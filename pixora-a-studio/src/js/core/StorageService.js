'use strict';

// StorageService - сохранение/загрузка проекта в localStorage
// формат: JSON c base64-снимками каждого слоя
export class StorageService {

    // ключ в localStorage - static property, принадлежит классу, не экземпляру
    static STORAGE_KEY = 'pixora-project';

    // созраняем текущее состояние проекта
    static save(stage) {
        // собираем данные каждого слоя
        const layersData = stage.layers.map((layer) => {
            // превращаем canvas в base64 строку
            const imageData = layer.canvas.toDataURL('image/png');

            // базовые поля - общие для всех типов слоёв
            const data = {
                id: layer.id,
                type: layer.type,
                visible: layer.visible,
                imageData,
            };

            // для image-слоёв сохраняем трансформацию
            if ( layer.type === 'image') {
                data.x = layer.x;
                data.y = layer.y;
                data.scale = layer.scale;
                data.rotation = layer.rotation;
            }

            return data;
        });

        // собираем объект проекта
        const project = {
            name: 'Pixora Project',
            width: stage.layers[0].canvas.width,
            height: stage.layers[0].canvas.height,
            layerIndex: stage.layerIndex,
            layers: layersData,
        };

        // сохраняем в localStorage как JSON-строку
        // localStorage - браузерное хранилище, данные живут даже после закрытия вкладки
        localStorage.setItem(
            StorageService.STORAGE_KEY,
            // объект -> строка.localStorage хранит ьлдбкл строки
            JSON.stringify(project)
        );

        console.log('Проект сохранён');
    }

    // загружаем проект из localStorage
    // возвращаем Promise - потому что загрузка картинок асинхроная
    static async load(stage) {
        // читаем JSON из localStorage
        const raw = localStorage.getItem(StorageService.STORAGE_KEY);

        // если ничего нет - выходим
        if ( !raw ) {
            console.log('Сохранённый проект не найден');
            return false;
        }

        // парсим строку обратно в объект
        const project = JSON.parse(raw);

        // console.log('слоёв до очистки:', stage.layers.length);

        // очищаем текущую сцену - удаляем слои
        while ( stage.layers.length > 0 ) {
            stage.removeLayer(stage.layers[0]);
        }

        // console.log('слоёв после очистки:', stage.layers.length);

        // восстанавливаем счётчик id
        stage.layerIndex = project.layerIndex;

        // массив промисов - ждём загрузку всех слоёв
        const promises = project.layers.map((data) => {
            return new Promise((resolve) => {
                // создаём слой нужного типа
                const layer = stage.addLayer({ type: data.type });

                // перезаписываем id и видимость
                layer.id = data.id;
                layer.visible = data.visible;
                layer.canvas.style.display = data.visible ? '' : 'none';

                // для image-слоёв восстанавливаем трансформации
                if ( data.type === 'image') {
                    layer.x = data.x;
                    layer.y = data.y;
                    layer.scale = data.scale;
                    layer.rotation = data.rotation;
                }

                // загружаем base64 картинку обратно в canvas
                const img = new Image();

                img.onload = () => {
                    // рисуем сохранённое изображение на canvas слое
                    layer.ctx.drawImage(img, 0, 0);

                    // для ImageLayer - перерисовываем с транформациями
                    if ( data.type === 'image' && layer.image ) {
                        layer.render();
                    }

                    resolve(layer);
                };

                // base64 строчка как источник картинки
                img.src = data.imageData;
            });
        });

        // ждём загрузку сех слоёв и возвращаем true
        await Promise.all(promises);
            console.log('Проект загружен');
            return true;
    }
}