'use strict';

import { ToolBase } from "./ToolBase.js";

// MoveTool - перемещение ImageLayer по canvas
// в отличии от Brush/Eraser полностью переопределяет activate/deactivate
// потому что логика другая: не рисуем, а двигаем картинку
// использует shiftX/shiftY для точного захвата
export class MoveTool extends ToolBase {
    constructor(layer, history) {
        super(layer, history);

        // флаг перетаскивани
        // _isActive - инструмент выбран в панели
        // _isDrawing - пользователь зажал кнопку и тащит
        this._isDragging = false;

        // смещение курсора относительно левого вернего угла картинки
        // без этого картинка прыгнет углом к курсору при захвате
        this._shiftX = 0;
        this._shiftY = 0;
    }

    // MoveTool не рисует - настройки не нужны
    applySettings() {}

    // полностью своя логика активации
    activate() {
        this._isActive = true; // флаг
        const canvas = this.layer.canvas;

        // pointerdown - захватываем картинку
        this._onPointerDown = (e) => {
            // move - работает только с image-слоями
            if ( this.layer.type !== 'image' ) return;

            this._isDragging = true;
            const { x, y } = this._getCoords(e);

            // запоминаем точку захвата внутри картинки
            this._shiftX = x - this.layer.x;
            this._shiftY = y - this.layer.y;

            // сохраняем историю для undo
            if ( this.history ) {
                this.history.save(this.layer);
            }

            // меняем курсор
            canvas.style.cursor = 'grabbing';
        };

        // pointermove - двигаеем картнку за курсором
        this._onPointerMove = (e) => {
            if  ( !this._isDragging ) return;

            const { x, y } = this._getCoords(e);

            // новая позиция = курсор минус смещение захвата
            this.layer.x = x - this._shiftX;
            this.layer.y = y - this._shiftY;

            // перерисовываем картинку на новом месте
            this.layer.render();
        };

        // pointerup - отпустили
        this._onPointerUp = () => {
            if ( !this._isDragging ) return;
            this._isDragging = false;
            canvas.style.cursor = 'grab';
        };

        // onpointerleave - курсор ушёл за canvas
        this._onPointerLeave = () => {
            if ( !this._isDragging ) return;
            this._isDragging = false;
            canvas.style.cursor = 'grab';
        }

        // устанавливаем курсор - кука
        canvas.style.cursor = 'grab';

        canvas.addEventListener('pointerdown', this._onPointerDown);
        canvas.addEventListener('pointermove', this._onPointerMove);
        canvas.addEventListener('pointerup', this._onPointerUp);
        canvas.addEventListener('pointerleave', this._onPointerLeave);
    }

    // своя деактивация - сбрасываем курсор
    deactivate() {
        this._isActive = false;
        const canvas = this.layer.canvas;

        // убираем кастомный курсор
        canvas.style.cursor = '';

        canvas.removeEventListener('pointerdown', this._onPointerDown);
        canvas.removeEventListener('pointermove', this._onPointerMove);
        canvas.removeEventListener('pointerup', this._onPointerUp);
        canvas.removeEventListener('pointerleave', this._onPointerLeave);

        // обнуляем ссылки - как в родителе
        this._onPointerDown = null;
        this._onPointerMove = null;
        this._onPointerUp = null;
        this._onPointerLeave = null;
    }
}