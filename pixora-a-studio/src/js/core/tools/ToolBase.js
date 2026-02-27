'use strict';

// ToolBase - базовый класс для всех инструментов
// содержит общую логику: pointer-события, координаты, activate/deactivate
export class ToolBase {
    constructor(drawLayer, history) {
        this.drawLayer = drawLayer;
        this.history = history; // ссылка на объект History
    }

    // переключаем инструмент на другой слой
    setLayer(drawLayer) {
        // был ли активирован. !! - приведение к boolean 
        // (!!this._onPointerDown - если функуия существует: true)
        const wasActive = !!this._onPointerDown

        if ( wasActive ) this.deactivate();

        this.drawLayer = drawLayer;

        if ( wasActive ) this.activate();
    }

    // переопределяется в наследниках
    applySettings() {
        throw new Error('applySettings() должен быть реализован в наследнике');
    }

    activate() {
        const canvas = this.drawLayer.canvas;
        
        this._onPointerDown = (e) => {
            // сохраняем состояние до рисования
            if ( this.history ) {
                this.history.save(this.drawLayer);
            }
            
            const { x, y } = this._getCoords(e);
            this.applySettings();
            this.drawLayer.startDrawing(x, y);
        };

        this._onPointerMove = (e) => {
            const { x, y } = this._getCoords(e);
            this.drawLayer.draw(x, y);
        };

        this._onPointerUp = () => {
            this.drawLayer.stopDrawing();
            this._afterStroke();
        };

        // при уходе за пределы canvas, останавливаем рисование
        this._onPointerLeave = () => {
            this.drawLayer.stopDrawing();
            this._afterStroke();
        }

        canvas.addEventListener('pointerdown', this._onPointerDown);
        canvas.addEventListener('pointermove', this._onPointerMove);
        canvas.addEventListener('pointerup', this._onPointerUp);
        canvas.addEventListener('pointerleave', this._onPointerLeave);
    }
    
    deactivate() {
        const canvas = this.drawLayer.canvas;
        
        canvas.removeEventListener('pointerdown', this._onPointerDown);
        canvas.removeEventListener('pointermove', this._onPointerMove);
        canvas.removeEventListener('pointerup', this._onPointerUp);
        canvas.removeEventListener('pointerleave', this._onPointerLeave);
    }

    // хук после завершения штриха (переопределяют наследники если надо)
    _afterStroke() {}

    // координаты относительно canvas
    _getCoords(e) {
        const canvas = this.drawLayer.canvas;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }
}