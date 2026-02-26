'use strict';

import { DrawLayer } from "../layers/DrawLayer.js";

// отвечает только за "сцену": создание и управление canvas-слоями
export class Stage {
    constructor($container) {
        // ссылка на DOM-контейнер куда будут сохраняться слои
        this.$container = $container;

        this.layers = [];     // список canvas-слоёв
        this.layerIndex = 0; // счётчик для уникальных id
    }

    // создаёт новый canvas-слой и добавляет в стек
    addLayer({ type = 'draw' } = {}) {
        this.layerIndex += 1;

        // реальные размеры контейнера в пикселях
        const width = this.$container.clientWidth;
        const height = this.$container.clientHeight;

        // создаём canvas элемент
        const canvas = document.createElement('canvas');
        canvas.width = width; // реальный размер в писелях
        canvas.height = height;
        // всё позиционирование через CSS-класс
        canvas.classList.add('layer');

        // получаем 2D-контекст для рисования
        const ctx = canvas.getContext('2d');

        // создаём слой нужного типа
        let layer;

        if ( type === 'draw') {
            layer = new DrawLayer(canvas, ctx, `layer-${this.layerIndex}`);
        } else {
            throw new Error(`Неизвестный тип слоя: ${type}`);
        }

        // добавляем в DOM и массив
        this.$container.append(canvas);
        this.layers.push(layer);
        return layer;
    }
}