'use strict';

// DrawLayer - слой для рисования кистью
// наследует базовые свойства от Stage, управляет своиим canvas
export class DrawLayer {
    constructor(canvas, ctx) {
        // ссылки на canvas и контекст рисования
        this.canvas = canvas;
        this.ctx = ctx;

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