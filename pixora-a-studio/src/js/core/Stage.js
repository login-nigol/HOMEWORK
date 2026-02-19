'use strict';

// отвечает только за "сцену": создание и управление canvas-слоями
export class Stage {
    constructor($container) {
        this.$container = $container;

        this.layers = [];     // список canvas-слоёв
        this.layerIndex = 0; // для уникальных id
    }

    // создаёт новый canvas-слой и добавляет в стек
    addLayer({ width = 800, height = 600, type = 'draw' } = {}) {
        this.layerIndex += 1;

        // создаём canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // canvas лежит поверх других слоёв
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // canvas API: получаю контекст для рисования
        const ctx = canvas.getContext('2d');

        // JS-модель слоя (источник правды)
        const layer = {
            id: `layer-${this.layerIndex}`, // уникальный id
            type,                            // 'drow' | 'image' (будет расширен)
            canvas,                          // ссылка на DOM-элемент
            ctx,                             // контекст рисования
            visible: true                    // можно скрывать/показывать
        };

        // добавляем в DOM и в модель
        this.$container.append(canvas);
        this.layers.push(layer);

        return layer;
    }
}