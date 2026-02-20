'use strict';

// BrushTool - инструмент кисть
// управляет настройками кисти и навешивает pointer-события на canvas
export class BrushTool {
    constructor(drawLayer) {
        // ссылка на слой с которым работает кисть
        this.drawLayer = drawLayer;

        // настройки кисти по умолчанию
        this.color = '#000000';
        this.size = 5;
    }

    // применяем настройки кисти к контексту перед рисованием
    applySettings() {
        // цвет линии
        this.drawLayer.ctx.strokeStyle = this.color;

        // толщина линии
        this.drawLayer.ctx.lineWidth = this.size;

        // плавные стыки линий
        this.drawLayer.ctx.lineJoin = 'round';
        this.drawLayer.ctx.lineCap = 'round';
    }

    // активируем кисть: навешиваем pointer-сообытия на canvas
    activate() {
        const canvas = this.drawLayer.canvas;

        // сохраняем ссылки на обработчики чтобы потом снять
        this._onPointerDown = (e) => {
            // получаем координаты относительно canvas
            const { x, y } = this._getCoords(e);
            this.applySettings();
            this.drawLayer.startDrawing(x, y);
        };

        this._onPointerMove = (e) => {
            const { x, y } = this._getCoords(e);
            this.drawLayer.draw(x,y);
        };

        this._onPointerUp = () => {
            this.drawLayer.stopDrawing();
        };

        // навешиваем событие
        canvas.addEventListener('pointerdown', this._onPointerDown);
        canvas.addEventListener('pointermove', this._onPointerMove);
        canvas.addEventListener('pointerup', this._onPointerUp);
    }
    
    // деактивируем кисть: сеимаем все pointer-события
    deactivate() {
        const canvas = this.drawLayer.canvas;

        canvas.removeEventListener('pointerdown', this._onPointerDown);
        canvas.removeEventListener('pointermove', this._onPointerMove);
        canvas.removeEventListener('pointerup', this._onPointerUp);
    }

    // получаем координаты pointer-события относительно canvas
    _getCoords(e) {
        const canvas = this.drawLayer.canvas;
        const rect = canvas.getBoundingClientRect();

        // коофициент масштаба: реальный размер / визуальный
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }
}