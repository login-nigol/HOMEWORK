'use strict';

import { ExportService } from "./ExportService.js";

// ShareService - шаринг проекта через AjaxStringStorage2
// сохраняет данные на сервер, генерирует ссылку для получателя
export class ShareService {

    // URL серверного скрипта
    static API_URL = 'https://fe.it-academy.by/AjaxStringStorage2.php';

    // префикс имён в базе (фамилия + проект)
    static PREFIX = 'ANTIPOV_PIXORA_';

    // === Базовые методы API ===

    // отправляем POST-запрос к AjaxStringStorage2
    static async _request(param) {
        // FormData - формат для POST-запроса
        const formData = new FormData();

        // заполняем параметры из объекта
        for ( const key in param ) {
            formData.append(key, param[key]);
        }

        // fetch - современный AJAX
        const response = await fetch(ShareService.API_URL, {
            method: 'POST',
            body: formData,
        });

        // парсим JSON-ответ от сервера
        return await response.json();
    }

    // READ - прочитать строку по имени
    static async read(name) {
        return await ShareService._request({
            f: 'READ',
            n: ShareService.PREFIX + name,
        });
    }

    // INSERT - создать новую строку
    static async insert(name, value) {
        return await ShareService._request({
            f: 'INSERT',
            n: ShareService.PREFIX + name,
            v: value,
        });
    }

    // LOCKGET - заблокировать строку для обновления
    static async lockGet(name, password) {
        return await ShareService._request({
            f: 'LOCKGET',
            n: ShareService.PREFIX + name,
            p: password,
        });
    }

    // UPDATE - обновить заблокированную строку
    static async update(name, value, password) {
        return await ShareService._request({
            f: 'UPDATE',
            n: ShareService.PREFIX + name,
            v: value,
            p: password,
        });
    }

    // === Методы шаринга ===
    
    // генерируем уникальный ключ для ссылки
    static _generateKey() {
        // timestamp + случайное число = уникальность
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    // поделиться готовой картинкой (только просмотр)
    static async shareImage(stage) {
        // переиспользуем склейку из ExportService
        const tempCanvas = ExportService.mergeCanvas(stage);

        // data:image/png;base64 - картинка закодированная в текст
        const imageData = tempCanvas.toDataURL('image/png');

        // генерируем уникальный ключ
        const key = 'IMG_' + ShareService._generateKey();

        // сохраняем на сервер через INSERT
        const result = await ShareService.insert(key, imageData);

        // проверяем ошибки
        if ( result.error ) {
            throw new Error('Ошибка сохранения: ' +result.error);
        }

        // формируем ссылку для получателя
        // берём текущий адрес страницы + параметр ?view=ключ
        const url = new URL(window.location.href);
        url.searchParams.set('view', key);

        return url.toString();        
    }

    // поделится проектом (можно редактировать)
    static async shareProject(stage) {
        // собираем JSON проекта
        const layersData = stage.layers.map((layer) => {
            const data = {
                id: layer.id,
                type: layer.type,
                visible: layer.visible,
                imageData: layer.canvas.toDataURL('image/png'),
            };

            if ( layer.type === 'image') {
                data.x = layer.x;
                data.y = layer.y;
                data.scale = layer.scale;
                data.rotation = layer.rotation;
            }

            return data;
        });

        const project = {
            name: 'Pixora Project',
            width: stage.layers[0].canvas.width,
            height: stage.layers[0].canvas.height,
            layerIndex: stage.layerIndex,
            layers: layersData,
        };

        // генерируем уникальны ключ
        const key = 'PRJ_' + ShareService._generateKey();

        // сохраняем JSON на сервер
        const result = await ShareService.insert(key, JSON.stringify(project));

        if ( result.error ) {
            throw new Error('Ошибка сохранения' + result.error);            
        }

        // формируем ссылку с параметром ?project=ключ
        const url = new URL(window.location.href);
        url.searchParams.set('project', key);

        return url.toString();
    }

    // загрузить картинку по ключу (для получателя)
    static async loadSharedImage(key) {
        const result = await ShareService.read(key);

        if ( result.error ) {
            throw new Error('Ошибка загрузки' + result.error);            
        }

        // result.result - base64 строка картинки
        return result.result;
    }

    // загрузить проект по ключу
    static async loadSharedProject(key) {
        const result = await ShareService.read(key);

        if ( result.error ) {
            throw new Error('Ошибка загрузки' + result.error);            
        }

        // парсим JSON обратно в объект
        return JSON.parse(result.result);
    }
}
