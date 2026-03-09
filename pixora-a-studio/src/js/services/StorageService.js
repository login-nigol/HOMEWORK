'use strict';

// StorageService - сохранение/загрузка проекта в localStorage
// формат: JSON c base64-снимками каждого слоя
export class StorageService {

    // ключ в localStorage - static property, принадлежит классу, не экземпляру
    static STORAGE_KEY = 'pixora-project';

    // сохраняем текущее состояние проекта
    static save(stage) {
        // собираем данные каждого слоя
        const layersData = stage.layers.map((layer) => {

            let imageData;

            // image-слой: сохраняем оригинальную картинку, не весь canvas
            if ( layer.type === 'image' && layer.image ) {
                const temp = document.createElement('canvas');
                temp.width = layer.image.width;
                temp.height = layer.image.height;
                temp.getContext('2d').drawImage(layer.image, 0, 0);
                imageData = temp.toDataURL('image/png');
            } else {
                // drow-слой: сохраняем весь canvas
                imageData = layer.canvas.toDataURL('image/png');
            }
            // console.log(layer.id, layer.type, imageData.slice(0, 50));

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
        // localStorage - браузерное хранилище, данные живут 
        // даже после закрытия вкладки
        localStorage.setItem(
            StorageService.STORAGE_KEY,
            // объект -> строка.localStorage хранит только строки
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
                console.log('загружен:', data.id, data.type, img.width, img.height);

                img.onload = () => {

                    // сохраняем ссылку на Image
                    if ( data.type === 'image') {

                        // console.log('загружен слой:', data.id, 'size:', img.width, img.height);
                        layer.image = img;
                        layer.render(); /* перерисовываем с трансформацией */
                    } else {
                        // drow-слой просто копируем пиксели
                        layer.ctx.drawImage(img, 0, 0);
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