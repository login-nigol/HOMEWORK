'use strict';

// StickerService - зпгрузка и отрисовака стикеров/разукрашек
// загружает спрайт через AJAX (fetch), вырезает нужный элемент по индексу
export class StickerService {

    // размер одного элемента в стпрайте
    static SPRITE_SIZE = 100;

    // пути к спрайтам
    static SPRITES = {
        stickers: './assets/stickers.svg',
        coloring: './assets/coloring.svg',
    }

    // колчество элементов в каждом спрайте
    static COUNT = 5;

    // кэш загруженных спрайтов (не грузим дважды)
    static _cache = {};

    // загружаем спрайт по типу
    static async loadSprite(type) {
        // если уже загружен возвращаем из кэша
        if ( StickerService._cache[type] ) {
            return StickerService._cache[type];
        }

        // загружаем через fetch (AJAX)
        const response = await fetch(StickerService.SPRITES[type]);
        if ( !response.ok )
            throw new Error(`Не удалось загрузить спрайт ${type}`);
            
        // конвертируем в blob -> objectURL -> Image
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // кэшируем и возвращаем
                StickerService._cache[type] = img;
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    // вырезаем элемент из справйта по инексу и добовляем на сцену
    static async addToStage(type, index, stage) {
        const sprite = await StickerService.loadSprite(type);
        const size = StickerService.SPRITE_SIZE;

        // создаём image-слой
        const layer = stage.addLayer({ type: 'image'});

        // создаём временный canvas для вырезания элемента из справйта
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCTX = tempCanvas.getContext('2d');

        // вырезаем нужный элемент: sx = index * size
        tempCTX.drawImage(sprite, index * size, 0, size, size, 0, 0, size, size);

        // загружаем вырезанный элемент в слой как картинку
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                layer.image = img;
                layer.scale = 1;
                // центрируем на canvas
                layer.x = (layer.canvas.width - size) / 2;
                layer.y = (layer.canvas.height - size) / 2;
                layer.render();
                resolve(layer);
            };
            img.src = tempCanvas.toDataURL();
        });
    }
}