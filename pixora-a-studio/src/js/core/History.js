'use strict';

import { HISTORY_LIMIT } from "../constants.js";

// History - undo/redo для canvas слоя
// хранит снимки ImageData, позволяет откатывать и возвращать
export class History {
    constructor() {
        // стек состояний: каждый элемент = { layerId, imageData }
        this._undoStack = [];
        this._redoStack = [];
    }

    // сохраняем текущее состояние canvas перед изменением
    save(layer) {
        const imageData = layer.ctx.getImageData(
            0, 0,
            layer.canvas.width,
            layer.canvas.height
        );

        this._undoStack.push({
            layerId: layer.id,
            imageData,
        });

        // ограничиваем размер стека
        if ( this._undoStack.length > HISTORY_LIMIT ) {
            this._undoStack.shift();
        }

        // после нового действия redo-стек сбрасывается
        this._redoStack = [];
    }

    // отменяем последнее действие
    undo(stage) {
        if ( this._undoStack.length === 0 ) return;

        const entry = this._undoStack.pop();
        const layer = stage.layers.find((l) => l.id === entry.layerId);
        if ( !layer ) return;

        // сохраняем текущее состояние в redo
        const currentData = layer.ctx.getImageData(
            0, 0,
            layer.canvas.width,
            layer.canvas.height
        );

        this._redoStack.push({
            layerId: layer.id,
            imageData: currentData,
        });

        // восстанавливаеем предыдущее состояние
        layer.ctx.putImageData(entry.imageData, 0, 0);
    }

    // повторяем отменённое действие
    redo(stage) {
        if ( this._redoStack.length === 0 ) return;

        const entry = this._redoStack.pop();
        const layer = stage.layers.find((l) => l.id === entry.layerId);
        if ( !layer ) return;

        // сохраняем текущее в undo
        const currentData = layer.ctx.getImageData(
            0, 0,
            layer.canvas.width,
            layer.canvas.height
        );

        this._undoStack.push({
            layerId: layer.id,
            imageData: currentData,
        });

        // восстанавливаем
        layer.ctx.putImageData(entry.imageData, 0, 0);
    }
}