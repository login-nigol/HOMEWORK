'use strict';

import { ToolBase } from "./ToolBase.js";

// EraserTool - инструмент ластик
// стирает пиксели через смену режима наложения (compositing)
export class EraserTool extends ToolBase {
    constructor(layer, history, sound) {
        super(layer, history, sound);

        // размер ластика по умолчанию
        this.size = 15;
    }

    // применяем настройки ластика перед штрихом
    applySettings() {
        const ctx = this.layer.ctx;

        // destionation-out - режим вырезания, рисуем прозрачность
        // вместо добавления пикселей - вырезаем их
        ctx.globalCompositeOperation = 'destination-out';

        ctx.lineWidth = this.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }

    // метод заглушка в родителе
    // хук после штриха - обязательно возвращаем режим наложения
    // без этого кисто после ластика будет тоже стирать
    _afterStroke() {
        this.layer.ctx.globalCompositeOperation = 'source-over';
    }
}