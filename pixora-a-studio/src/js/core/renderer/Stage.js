'use strict';

import { DrawLayer } from "../layers/DrawLayer.js";
import { ImageLayer } from "../layers/ImageLayer.js";

// фабрика и менеджер слоёв
// Stage - управляет сценой: создание, удаление, порядок слоёв
// каждый слой = отдельный canvas, уложеный в стек (position: absolute)
export class Stage {
    constructor($container) {
        // DOM-контейнер куда складываем canvas-элементы
        this.$container = $container;

        // массив всех слоёв (порядок = порядок отрисовки)
        this.layers = [];

        // счётчик для генирации уникальных id
        this.layerIndex = 0;

        // текущий активный слой (с ним работает инструмент)
        this.activeLayer = null;
    }

    // создаёт новый canvas-слой и добавляет в стек
    // type: 'draw' - рисование, 'image' - картинка
    addLayer({ type = 'draw' } = {}) {
        this.layerIndex += 1;

        // берём реальные размеры контейнера в пикселях
        const width = this.$container.clientWidth;
        const height = this.$container.clientHeight;

        console.log('addLayer size:', width, height);

        // создаём DOM-элемент canvas
        const canvas = document.createElement('canvas');
        canvas.width = width; // реальный размер в писелях
        canvas.height = height;

        // всё позиционирование через CSS-класс
        canvas.classList.add('layer');

        // получаем 2D-контекст для рисования
        // willReadFrequently: true - оптимизация для для getImageData (undo/redo)
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // создаём слой нужного типа (паттерн "фабрика")
        let layer;

        if ( type === 'draw') {
            layer = new DrawLayer(canvas, ctx, `layer-${this.layerIndex}`);
        } else if ( type === 'image') {
            layer = new ImageLayer(canvas, ctx, `img-${this.layerIndex}`);
        } else {
            throw new Error(`Неизвестный тип слоя: ${type}`);            
        }

        // добавляем canvas в DOM (появляется на экране)
        this.$container.append(canvas);

        // добавляем в массив слоёв
        this.layers.push(layer);

        // новый слой сразу становится активным
        this.activeLayer = layer;

        return layer;
    }

    // поднимаем canvas активного слоя наверх DOM-стека
    // визуально: слой отрисуется поверх остальных
    bringToFront(layer) {
        // append перемещает существующий элемент в конец контейнера
        // последний в DOM = самый верхний визуально
        this.$container.append(layer.canvas);
    }

    // удаляем слой из сцены
    removeLayer(layer) {

        // console.log('removeLayer:', layer.id, 'index:', this.layers.indexOf(layer));

        const index = this.layers.indexOf(layer);
        if ( index === -1 ) return;

        // удаляем canvas из DOM
        layer.canvas.remove();

        // убираем из массива
        this.layers.splice(index, 1);

        // console.log('после splice:', this.layers.length);

        // если удалили активный - переключаемся на последний
        if ( this.activeLayer === layer ) {
            this.activeLayer = this.layers[this.layers.length - 1] || null;
        }
    }

    // меняем порядок слоя в стеке
    // direction: +1 выше (вперёд в масстве), -1 ниже (назад)
    moveLayer(layer, direction) {
        const index = this.layers.indexOf(layer);
        const newIndex = index + direction;

        // проверяем границы массива
        if ( newIndex < 0 || newIndex >= this.layers.length ) return;

        // деструктуризация - меняем местами два элемента в массиве
        [this.layers[index], this.layers[newIndex]] = 
        [this.layers[newIndex], this.layers[index]];

        // пересобираем порядок canvas в DOM
        // append каждого по очереди = правильный порядок
        this.layers.forEach((l) => this.$container.append(l.canvas));
    }

    // переключаем видимость слоя
    toggleLayer(layer) {
        layer.visible = !layer.visible;

        // display: none - canvas не рендерится и не ловит события
        layer.canvas.style.display = layer.visible ? '' : 'none';
    }
}