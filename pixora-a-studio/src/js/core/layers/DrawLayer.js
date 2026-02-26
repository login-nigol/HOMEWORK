'use strict';

// DrawLayer - слой для рисования кистью
// Управляет рисованием на конкретном canvas-слое
export class DrawLayer {
    constructor(canvas, ctx, id) {
        // ссылки на canvas и контекст рисования
        this.canvas = canvas;
        this.ctx = ctx;

        // идентификация слоя
        this.id = id;
        this.type = 'draw';
        this.visible = true;

        // флаг: сейчас рисуем или нет
        this.isDrawing = false;
    }

    // начало рисования - запоминаем стартовую точку
    startDrawing(x, y) {
        this.isDrawing = true;

        // начинаем новый путь на canvas
        this.ctx.beginPath();

        // перемещаем "перо" в точку касания
        this.ctx.moveTo(x, y);
    }

    // рисование во время движения(мыши и тп)
    draw(x, y) {
        // если кнопка мыши не зажата ничего не делаем
        if ( !this.isDrawing ) return;

        // рисуем линию от  предыдущей точки до текущей
        this.ctx.lineTo(x, y);

        // отображаем линию на canvas
        this.ctx.stroke();
    }

    // конец рисования - отпустили кнопку/палец
    stopDrawing() {
        this.isDrawing = false;

        // закрываем текущий путь
        this.ctx.closePath();
    }
}