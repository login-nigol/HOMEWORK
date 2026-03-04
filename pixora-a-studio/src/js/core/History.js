'use strict';

import { HISTORY_LIMIT } from "../constants.js";

// History - undo/redo для canvas слоя
// хранит снимки пикселей (ImageData), и позволяет откатывать изменения
export class History {
    constructor() {
        // стек отмены - сюда попадают снимки перед каждым действием
        this._undoStack = [];

        // стек повтора - сюда попадают снимки при undo
        this._redoStack = [];
    }

    // сохраняем текущее состояние canvas перед изменением
    // вызывается в ToolBase._onPointerDown - до начало рисования
    save(layer) {
        // getImageData - копирует все пиксели в canvas в объект IimageData
        // это фотография canvas в данный момент
        const imageData = layer.ctx.getImageData(
            0, 0,
            layer.canvas.width,
            layer.canvas.height
        );

        // кладём снимок в стек вместе с id слоя
        // id нужен чтобы при undo восстановить правильный слой
        this._undoStack.push({
            layerId: layer.id,
            imageData,
        });

        // ограничиваем размер стека - память не резиновая
        // shift() - удаляет самый старый снимок (правый элемент)
        if ( this._undoStack.length > HISTORY_LIMIT ) {
            this._undoStack.shift();
        }

        // после нового действия redo-стек сбрасывается
        // нельзя повторить если сделал что то новое
        this._redoStack = [];
    }

    // отмена последнего действия
    undo(stage) {
        // ничего не отменять
        if ( this._undoStack.length === 0 ) return;

        // достаём последний снимок
        const entry = this._undoStack.pop();

        // ищем слой по id в массиве слоёв сцены
        const layer = stage.layers.find((l) => l.id === entry.layerId);
        if ( !layer ) return;

        // сначало сохраняем текущее состояние в redo
        // чтобы можно было вернуть обратно
        const currentData = layer.ctx.getImageData(
            0, 0,
            layer.canvas.width,
            layer.canvas.height
        );

        this._redoStack.push({
            layerId: layer.id,
            imageData: currentData,
        });

        // .putImageData - вставляем снимок обратно в canvas
        // canvas возвращается к предыдущему сотоянию
        layer.ctx.putImageData(entry.imageData, 0, 0);
    }

    // повтор отменённого действия
    redo(stage) {
        // ничего не повторять
        if ( this._redoStack.length === 0 ) return;

        const entry = this._redoStack.pop();
        const layer = stage.layers.find((l) => l.id === entry.layerId);
        if ( !layer ) return;

        // сохраняем текущее в undo перед восстановлением
        const currentData = layer.ctx.getImageData(
            0, 0,
            layer.canvas.width,
            layer.canvas.height
        );

        this._undoStack.push({
            layerId: layer.id,
            imageData: currentData,
        });

        // восстанавливаем состояние из redo
        layer.ctx.putImageData(entry.imageData, 0, 0);
    }
}