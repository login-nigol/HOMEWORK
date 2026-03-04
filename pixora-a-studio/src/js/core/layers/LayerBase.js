'use strict';

// LayerBase - базовый класс слоя (паттерн)
// содержит общее: canvas, контекст, идентификация, методы рисования
export class LayerBase {
    constructor(canvas, ctx, id, type) {
        // ссылки на DOM-элемент и его 2D-контекст
        this.canvas = canvas;
        this.ctx = ctx;

        // идентиыфикация слоя
        this.id = id;
        this.type = type; // 'draw' или 'image'
        this.visible = true;

        // флаг: идёт ли сейчас рисование
        this.isDrawing = false;
    }

    // начало штриха - запоминаем стартовую точку
    startDrawing(x, y) {
        this.isDrawing = true;

        // beginPath() - начинаем новый путь на canvas
        this.ctx.beginPath();

        // перемещаем "перо" в точку касания
        this.ctx.moveTo(x, y);
    }

    // продолжение штриха - мышь движется с зажатой кнопкой
    draw(x, y) {
        // если кнопка мыши не зажата ничего не делаем
        if ( !this.isDrawing ) return;

        // lineTo() - рисуем линию от предыдущей точки до текущей
        this.ctx.lineTo(x, y);

        // stroke() - отрисовываем линию на canvas
        // вызываем каждый раз чтобы видеть линию в реальном времени
        this.ctx.stroke();
    }

    // конец рисования - отпустили кнопку/палец
    stopDrawing() {
        // защита: если рисование не начиналось - ничего не делаем
        if ( !this.isDrawing ) return;

        this.isDrawing = false;

        // closePath() - закрываем текущий путь
        this.ctx.closePath();
    }
}