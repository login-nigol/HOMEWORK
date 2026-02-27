'use strict';

import { DrawLayer } from "../layers/DrawLayer.js";
import { ImageLayer } from "../layers/ImageLayer.js";

// отвечает только за "сцену": создание и управление canvas-слоями
export class Stage {
    constructor($container) {
        // ссылка на DOM-контейнер куда будут сохраняться слои
        this.$container = $container;
        this.layers = [];     // список canvas-слоёв
        this.layerIndex = 0; // счётчик для уникальных id
        this.activeLayer = null;
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
        // { willReadFrequently: true } - оптимизация для частого чтения пикселей
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // создаём слой нужного типа
        let layer;

        if ( type === 'draw') {
            layer = new DrawLayer(canvas, ctx, `layer-${this.layerIndex}`);
        } else if ( type === 'image') {
            layer = new ImageLayer(canvas, ctx, `img-${this.layerIndex}`);
        } else {
            throw new Error(`Неизвестный тип слоя: ${type}`);            
        }

        // добавляем в DOM и массив
        this.$container.append(canvas);
        this.layers.push(layer);
        this.activeLayer = layer;
        return layer;
    }

    // поднимаем canvas активного слоя наверх стека
    bringToFront(layer) {
        this.$container.append(layer.canvas);
    }

    // удаляем слой
    removeLayer(layer) {
        const index = this.layers.indexOf(layer);
        if ( index === -1 ) return;

        // удаляем canvas из DOM
        layer.canvas.remove();

        // удаляем из массива
        this.layers.splice(index, 1);

        // если удалили активный - переключаемся
        if ( this.activeLayer === layer ) {
            this.activeLayer = this.layers[this.layers.length - 1] || null;
        }
    }

    // меняем порядок слоя (direction: -1 вверх, +1 вниз)
    moveLayer(layer, direction) {
        const index = this.layers.indexOf(layer);
        const newIndex = index + direction;

        // проверяем границы
        if ( newIndex < 0 || newIndex >= this.layers.length ) return;

        // меняем местами в массиве
        [this.layers[index], this.layers[newIndex]] = [this.layers[newIndex], this.layers[index]];

        // пересобираем порядок в DOM
        this.layers.forEach((l) => this.$container.append(l.canvas));
    }

    // переключаем видимость слоя
    toggleLayer(layer) {
        layer.visible = !layer.visible;
        layer.canvas.style.display = layer.visible ? '' : 'none';
    }
}