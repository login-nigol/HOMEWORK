'use strict';

// ExportService - экспорт проекта в PNG
// склеивает все видимые слои в одну картинку и скачивает файл
export class ExportService {

    // принимает Stage - берёт отттуда слои и размеры
    static exportPNG(stage) {
        // создаём временный canvas для склейки
        const tempCanvas = document.createElement('canvas');
        const firstLayer = stage.layers[0];

        // размеры берём из первого слоя (все одинаковые)
        tempCanvas.width = firstLayer.canvas.width;
        tempCanvas.height = firstLayer.canvas.height;

        const tempCtx = tempCanvas.getContext('2d');

        // проходим по слоям снизу вверх - порядок отрисовки
        stage.layers.forEach(layer => {
            // пропускаем скрытые слои
            if ( !layer.visible ) return;

            // рисуем содержимое слоя на верхний canvas
            tempCtx.drawImage(layer.canvas, 0, 0);
        });

        // перемещаем canvas в Data URL формата PNG
        // data:image/png;base64 - картинка закодированная в текст
        const dataURL = tempCanvas.toDataURL('image/png');

        // создаём скрытую ссылку для скачивания
        const link = document.createElement('a');
        link.download = 'pixora-export.png';
        link.href = dataURL;

        // программно кликаем - браузер начнёт скачивание
        link.click();
    }
}