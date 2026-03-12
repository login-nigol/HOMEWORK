'use strict';

// StickerServiceSvg - зпгрузка SVG-спрайта и отрисовака стикеров/разукрашек
// загружает sprites.svg через AJAX (fetch), рендерит symbol по id черезе Image
export class StickerServiceSvg {

    // размер одного элемента в стпрайте
    // static SPRITE_SIZE = 100;

    // пути к спрайтам
    static SPRITES = {
        stickers: './assets/stickers.svg',
        coloring: './assets/coloring.svg',
    }

    // id символов в каждом спрайте
    static SYMBOLS = {
        stickers: ['heart', 'cake', 'tree', 'star', 'rainbow'],
        coloring: ['c-sun', 'c-flower', 'c-butterfly', 'c-house', 'c-cat'],
    };

    // размер превью и стикера на canvas
    static SIZE = 300;

    // колчество элементов в каждом спрайте
    // static COUNT = 5;

    // кэш: хранит текст SVG по типу (не грузим дважды)
    static _cache = {};

    // загружаем спрайт по типу
    static async loadSvg(type) {
        // если уже загружен возвращаем из кэша
        if ( StickerServiceSvg._cache[type] ) {
            return StickerServiceSvg._cache[type];
        }

        // fetch - AJAX-запрос за SVG-файлом
        const response = await fetch(StickerServiceSvg.SPRITES[type]);
        if ( !response.ok )
            throw new Error(`Не удалось загрузить: ${type}`);
            
        // получаем текст SVG
        const svgText = await response.text();
        StickerServiceSvg._cache[type] = svgText;
        return svgText;

        // return new Promise((resolve, reject) => {
        //     const img = new Image();
        //     img.onload = () => {
        //         // кэшируем и возвращаем
        //         StickerService._cache[type] = img;
        //         resolve(img);
        //     };
        //     img.onerror = reject;
        //     img.src = url;
        // });
    }

    // формируем SVG-строку для конкретного символа
    // берём <defs> из спрайта + <use> нужеого символа
    static _buildSvg(svgText, symbolId) {
        const size = StickerServiceSvg.SIZE;

        // извлекаем нужный <symbol> из текста SVG
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const symbol = doc.getElementById(symbolId);
        if ( !symbol )
            throw new Error(`Символ не найден: ${symbolId}`);
        
        // берём viewBox из symbol
        const viewBox = symbol.getAttribute('viewBox')
            || `0 0 ${size} ${size}`;

            // строим самодостаточный SVG  с содержимым символа
            return `<svg xmlns="http://www.w3.org/2000/svg"
                width="${size}" height="${size}" viewBox="${viewBox}">
                ${symbol.innerHTML}
                </svg>`;
    }

    // добавляем стикер на сцену как image-слой
    static async addToStage(type, symbolId, stage) {
        const svgText = await StickerServiceSvg.loadSvg(type);
        const svgString = StickerServiceSvg._buildSvg(svgText, symbolId);
        const size = StickerServiceSvg.SIZE;

        // создаём image-слой
        // const layer = stage.addLayer({ type: 'image'});

        // конвертируем SVG-строку в blob -> objectURL -> Image
        const blob = new Blob([svgString], { type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);

        
        // вырезаем нужный элемент: sx = index * size
        // tempCTX.drawImage(sprite, index * size, 0, size, size, 0, 0, size, size);
        
        // загружаем вырезанный элемент в слой как картинку
        return new Promise((resolve) => {

            const img = new Image();
            img.onload = () => {
                // создаём image-слой
                const layer = stage.addLayer({ type: 'image'});

                // создаём временный canvas для SVG
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = size;
                tempCanvas.height = size;
                const tempCTX = tempCanvas.getContext('2d');
                tempCTX.drawImage(img, 0, 0, size, size);

                // создаём новый Image из растеризованнгго canvas
                const rasterImg = new Image();
                rasterImg.onload = () => {
                    layer.image = rasterImg;
                    layer.scale = 1;

                    // центрируем на canvas
                    layer.x = (layer.canvas.width - size) / 2;
                    layer.y = (layer.canvas.height - size) / 2;
                    layer.render();

                    // освобождаем objectURL
                    URL.revokeObjectURL(url);
                    resolve(layer);
                };
                rasterImg.src = tempCanvas.toDataURL();
            };
            img.src = url;
        });
    }
}