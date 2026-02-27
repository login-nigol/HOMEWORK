'use strict';

import { ToolBase } from "./ToolBase.js";

// MoveTool - перемещение ImageLayer по canvas
// использует shiftX/shiftY для точного захвата
export class MoveTool extends ToolBase {
    constructor(drawLayer, history) {
        super(drawLayer, history);

        this._isDragging = false;
        this.shiftX = 0; // смещение курсора внутри картинки
        this.shiftY = 0;
    }

    applySettings() {}

    activate() {
        const canvas = this.drawLayer.canvas;

        this._onPointerDown = (e) => {
            if ( this.drawLayer.type !== 'image' ) return;
            if ( !this.drawLayer ) return;

            this._isDragging = true;
            const { x, y } = this._getCoords(e);

            // запоминаем точку захвата внутри картинки
            this._shiftX = x - this.drawLayer.x;
            this._shiftY = y - this.drawLayer.y;

            // сохраняем историю
            if ( this.history ) {
                this.history.save(this.drawLayer);
            }

            // меняем курсор
            canvas.style.cursor = 'grabbing';
        };

        this._onPointerMove = (e) => {
            if  ( !this._isDragging ) return;

            const { x, y } = this._getCoords(e);

            // двигаем ровно на смещение курсора
            this.drawLayer.x = x - this._shiftX;
            this.drawLayer.y = y - this._shiftY;

            this.drawLayer.render();
        };

        this._onPointerUp = () => {
            if ( !this._isDragging ) return;
            this._isDragging = false;
            canvas.style.cursor = 'grab';
        };

        this._onPointerLeave = () => {
            if ( !this._isDragging ) return;
            this._isDragging = false;
            canvas.style.cursor = 'grab';
        }

        // устанавливаем курсор
        canvas.style.cursor = 'grab';

        canvas.addEventListener('pointerdown', this._onPointerDown);
        canvas.addEventListener('pointermove', this._onPointerMove);
        canvas.addEventListener('pointerup', this._onPointerUp);
        canvas.addEventListener('pointerleave', this._onPointerLeave);
    }

    deactivate() {
        const canvas = this.drawLayer.canvas;

        canvas.style.cursor = '';

        canvas.removeEventListener('pointerdown', this._onPointerDown);
        canvas.removeEventListener('pointermove', this._onPointerMove);
        canvas.removeEventListener('pointerup', this._onPointerUp);
        canvas.removeEventListener('pointerleave', this._onPointerLeave);
    }
}