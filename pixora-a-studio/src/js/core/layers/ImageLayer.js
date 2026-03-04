'use strict';

import { LayerBase } from "./LayerBase.js";

// ImageLayer - слой загруженым изображением
// наследует рисование от LayerBase
// добовляет: загрузку файла, трансыормации, рендер
export class ImageLayer extends LayerBase {
    constructor(canvas, ctx, id) {
        super(canvas, ctx, id, 'image');

        // изображение
        this.image = null;

        // трансформации
        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.rotation = 0; // в радианах
    }

    // загружаем картинку из File объекта
    loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    this.image = img;

                    // масштабируем если картинка больше canvas
                    const scaleX = this.canvas.width / img.width;
                    const scaleY = this.canvas.height / img.height;
                    if ( scaleX < 1 || scaleY < 1 ) {
                        this.scale = Math.min(scaleX, scaleY) * 0.8;
                    }

                    // центрируем картинку на canvas
                    const w = img.width * this.scale;
                    const h = img.height * this.scale;
                    this.x = (this.canvas.width - w) / 2;
                    this.y = (this.canvas.height - h) / 2;

                    this.render();
                    resolve(this);
                };

                img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
            reader.readAsDataURL(file);
        });
    }

    // отрисовываем картинку с трансформациями
    render() {
        if ( !this.image ) return;

        const ctx = this.ctx;
        const img = this.image;
        const w = img.width * this.scale;
        const h = img.height * this.scale;

        // очищаем canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // сохраняем состояние контекста
        ctx.save();

        // переносим центр вращения в центр картинки
        const centerX = this.x + w / 2;
        const centerY = this.y + h / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);

        // рисуем картинку относительно центра
        ctx.drawImage(img, -w / 2, -h / 2, w, h);

        // восстанавливаем состояние
        ctx.restore();
    }

    // заглушки для совместимости с ToolBase
    // startDrawing() {}
    // draw() {}
    // stopDrawing() {}
}