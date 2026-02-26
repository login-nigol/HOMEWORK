'use strict';

import { ToolBase } from "./ToolBase.js";

// BrushTool - инструмент кисть
// наследует pointer-логику от ToolBase, добовляет свои настройки
export class BrushTool extends ToolBase {
    constructor(drawLayer) { // передаём drawLayer в ToolBase
        super(drawLayer);

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
}