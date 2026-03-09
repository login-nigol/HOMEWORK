'use strict';

import { StickerServiceSvg } from "../services/StickerServiceSvg.js";

// GalleryUi - паннель галереии стикеров и разукращек
// создаёт DOM программно, показывает превью, добовляет на сцену
export class GalleryUi {

    constructor(stage, layersPanel, switchLayerForTools, switchTool) {
        // ссылки на внешине модули
        this._stage = stage;
        this._layerPanel = layersPanel;
        this._switchLayerForTools =switchLayerForTools;
        this._switchTool =switchTool;

        // создаём DOM галереи
        this._panel = this._createPanel();
        document.body.append(this._panel);
    }

    // === создаём DOM ===

    _createPanel() {
        // оверлей - закрывается кликом вне панели
        const overLay = document.createElement('div');
        overLay.className = 'gallery';
        overLay.hidden = true;

        // внутренний блок
        overLay.innerHTML = `
        <div class="gallery__box">

            <!-- заголовок + закрытие -->
            <div class="gallery__header">
                <span class="gallery__title">Галерея</span>
                <button class="gallery__close">✕</button>
            </div>

            <!-- вкладки: стикеры . разукрашки -->
            <div class="gallery__tabs">
                <button class="gallery__tab gallery__tab--active" 
                data-type="stickers">🎨 Стикеры</button>
                <button class="gallery__tab" data-type="coloring">✏️ Разукрашки</button>
            </div>

            <!-- сетка превью --><div class="gallery__grid" id="galleryGrid"></div>
        </div>                
        `;

        // закрытие по кнопки
        overLay.querySelector('.gallery__close').addEventListener('click', () => {
            this.hide();
        });

        // закрытие по клику на оверлей (вне box)
        overLay.addEventListener('click' , (e) => {
            if ( e.target === overLay ) this.hide();
        });

        // преключение вкладок
        overLay.querySelectorAll('.gallery__tab').forEach((tab) => {
            tab.addEventListener('click', (e) => {
                // снимаем актив со всех
                overLay.querySelectorAll('.gallery__tab')
                    .forEach(t => t.classList.remove('gallery__tab--active'));
                
                // вешаем на нажатую
                e.currentTarget.classList.add('gallery__tab--active');

                // загружаем превью нужного типа
                this._loadPreviews(e.currentTarget.dataset.type);
            });
        });

        return overLay;
    }

    // === Управление ===

    // показываем галеоею, загружаем стикеры по умолчанию
    show(type = 'stickers') {
        // сбрасываем вкладки - всегда открываем стикеры
        this._panel.querySelectorAll('.gallery__tab')
            .forEach(t => t.classList.remove('gallery__tab--active'));
        this._panel.querySelector('[data-type="stickers"]')
            .classList.add('gallery__tab--active');
        
        this._panel.hidden = false;
        this._loadPreviews(type);
    }

    hide() {
        this._panel.hidden = true;
    }

    // === Превью ===

    // загружаем и рендерим превью для любого типа
    async _loadPreviews(type) {
        const grid = this._panel.querySelector('#galleryGrid');

        // показываем лоадер пока грузим
        grid.innerHTML = '<p class="gallery__loading">Загрузка...</p>';

        try {
            // загружаем SVG-спрайт (с кэшем - второй раз мнгновенно)
            const svgText = await StickerServiceSvg.loadSvg(type);
            const symbols = StickerServiceSvg.SYMBOLS[type];

            // очишаем и рендерим превью
            grid.innerHTML = '';

            symbols.forEach((symbolId) => {
                // строим SVG для превью
                const svgString = StickerServiceSvg._buildSvg(svgText, symbolId);

                // кнопка превью
                const btn = document.createElement('button');
                btn.className = 'gallery__item';
                btn.innerHTML = svgString;
                btn.title = symbolId;

                // клик - добавляет стикер на сцену
                btn.addEventListener('click', async () => {
                    await StickerServiceSvg.addToStage(type, symbolId, this._stage);

                    // переключаем инструмен на новый слой
                    this._switchLayerForTools(this._stage.activeLayer);
                    this._switchTool('move');
                    this._layerPanel.render();

                    this.hide();
                });

                grid.append(btn);
            });

        } catch (error) {
            grid.innerHTML = `<p class="gallery__error">Ошибка: ${error.message}</p>`;
        }
    }
}