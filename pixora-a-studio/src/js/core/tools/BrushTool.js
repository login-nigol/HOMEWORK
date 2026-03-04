'use strict';

import { ToolBase } from "./ToolBase.js";

// BrushTool - инструмент кисть
// наследует всю pointer-логику от ToolBase
// добовляет только свои настройки отрисовки
export class BrushTool extends ToolBase {
    constructor(layer, history) { // передаём layer в ToolBase
        // super() - вызов конструктора родителя(ToolBase)
        // передаём layer и history наверх по цепочке наследования
        super(layer, history);

        // настройки кисти по умолчанию
        this.color = '#000000';
        this.size = 5;
    }

    // переопределяем метод родителя - задаём стиль рисования
    // override - наследник заменяет метод родителя своей версией
    // вызывается в activate() -> _onPointerDown перед каждым штирхом
    applySettings() {
        const ctx = this.layer.ctx;

        // цвет линии
        ctx.strokeStyle = this.color;

        // толщина линии в пикселях
        ctx.lineWidth = this.size;

        // скргление стыков и концов линий - без этого будут зубйы
        ctx.lineJoin = 'round'; // стык двух сегментов
        ctx.lineCap = 'round'; // конец линии
    }
}