'use strict';

import { ShareService } from "../core/ShareService.js";

// ShareLoade - проверяет URL при загрузке старницы
// если есть параметры ?view= или ?prject= - загружает данные с сервера
export class ShareLoader {

    // проверяем URL и загружаем если есть параметры
    static async checkUrl(stage, layersPanel, switchLayerForTools) {
        const params = new URLSearchParams(window.location.search);

        const viewKey = params.get('view');
        if ( viewKey ) {
            await ShareLoader._loadImage(viewKey, stage);
            return true;
        }

        const projectKey = params.get('project');
        if ( projectKey ) {
            await ShareLoader._loadProject(projectKey, stage, layersPanel, switchLayerForTools);
            return true;
        }

        return false;
    }

    // загружаем картинку (только просмотр)
    static async _loadImage(key, stage) {
        try {
            const imageData = await ShareService.loadSharedImage(key);
            const img = new Image();

            img.onload = () => {
                const layer = stage.layers[0];
                layer.ctx.drawImage(img, 0, 0);
            };

            img.src = imageData;
        } catch (error) {
            console.error('Ошибка загрузки картинки', error);
        }
    }

    // загружаем проект для редактирования
    static async _loadProject(key, stage, layersPanel, switchLayerForTools) {
        try {
            const project = await ShareService.loadSharedProject(key);

            // очищаем сцену
            while ( stage.layers.lenght > 0 ) { 
                stage.removeLayer(stage,layers[0]);
            }

            stage.layerIndex = project.layerIndex;

            // восстанавливаем слои
            const promises = project.layers.map((data) => {
                return new Promise((resolve) => {
                    const layer = stage.addLayer({ type: data.type });
                    layer.id = data.id;
                    layer.visible = data.visible;
                    layer.canvas.style.display = data.visible ? '' : 'none';

                    if ( data.type === 'image') {
                        layer.x = data.x;
                        layer.y = data.y;
                        layer.scale = data.scale;
                        layer.rotation = data.rotation;
                    }

                    const img = new Image();
                    img.onload = () => {
                        layer.ctx.drawImage(img, 0, 0);
                        resolve(layer);
                    };
                    img.src = data.imageData;
                });
            });

            await Promise.all(promises);
            layersPanel.render();
            switchLayerForTools(stage.activeLayer);

        } catch (error) {
            console.error('Ошибка загрузки проекта', error);
        }
    }
}