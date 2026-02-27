'use strict';

import { ToolBase } from "./ToolBase.js";

// EraserTool - инструмент ластик
// стирает содержимое canvas через compositeOperation
export class EraserTool extends ToolBase {
    constructor(drawLayer, history) {
        super(drawLayer, history);

        // размер ластика по умолчанию
        this.size = 15;
    }

    // применяем настройки ластика
    applySettings() {
        const ctx = this.drawLayer.ctx;

        // режим вырезания - рисуем прозрачность
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = this.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    _afterStroke() {
        this.drawLayer.ctx.globalCompositeOperation = 'source-over';
    }
}