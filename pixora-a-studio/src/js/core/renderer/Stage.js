'use strict';

// отвечает только за "сцену": создание и управление canvas-слоями
export class Stage {
    constructor($container) {
        // ссылка на DOM-контейнер куда будут сохраняться слои
        this.$container = $container;

        this.layers = [];     // список canvas-слоёв
        this.layerIndex = 0; // счётчик для уникальных id
    }

    // создаёт новый canvas-слой и добавляет в стек
    addLayer({ width = 800, height = 600, type = 'draw' } = {}) {
        this.layerIndex += 1;

        // создаём canvas элемент
        const canvas = document.createElement('canvas');
        canvas.width = width; // реальный размер в писелях
        canvas.height = height;

        // всё позиционирование через CSS-класс
        canvas.classList.add('layer');

        // получаем 2D-контекст для рисования
        const ctx = canvas.getContext('2d');

        // JS-модель слоя - источник правды о слое
        const layer = {
            id: `layer-${this.layerIndex}`, // уникальный id
            type,                            // 'draw' | 'image' (будет расширен)
            canvas,                          // ссылка на DOM-элемент
            ctx,                             // контекст рисования
            visible: true                    // можно скрывать/показывать
        };

        // добавляем canvas в DOM и слой в массив
        this.$container.append(canvas);
        this.layers.push(layer);

        return layer;
    }
}