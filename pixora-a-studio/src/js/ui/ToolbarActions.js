'use strict';

import { ExportService } from "../services/ExportService.js";
import { StorageService } from "../services/StorageService.js";
import { ShareService } from "../services/ShareService.js";
import { ShareUi } from "../services/ShareUi.js";

// ToolbarActions - обработка всех действий тулбара через делегирование
export class ToolbarActions {

    static init({ stage, sound, history, layersPanel, switchLayerForTools,
        createNewProject, getInstallPrompt, setInstallPrompt }) {

        document.addEventListener('click', async (e) => {
            // ищем ближайший элемент с data-action
            const btn = e.target.closest('[data-action]');
            if ( !btn ) return;

            const action = btn.dataset.action;

            switch ( action ) {
                // пропускаем - обрабатывается отдельными листенерами
                case 'zoom-in':
                case 'zoom-out':
                case 'undo':
                case 'redo':
                case 'mute':
                case 'menu':
                    return;

                // поделиться ссылкой на приложение
                case 'share-app': {
                    const url = window.location.origin + window.location.pathname;
                    try {
                        await ShareUi.share(url, 'Ссылка на приложение скопирована');
                    } catch (error) {
                        if ( error.name === 'AbortError' ) return;
                        alert('Ошиька: ' + error.message);
                    }
                    break;
                }

                // установить ярлык
                case 'install-app': {
                    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

                    if ( isIos ) {
                        // Safari не поддерживает beforeinstallprompt
                        alert('Для установкиЖ нажмите кнопку "Поделиться" -> "НА экран домой"');
                        break;
                    }

                    const prompt = getInstallPrompt();
                    if ( !prompt ) return;
                    prompt.prompt();
                    const { outcome } = await prompt.userChoice;
                    if ( outcome === 'accepted' ) {
                        document.querySelector('[data-action="install-app"]')
                            .setAttribute('hidden', '');
                    }
                    setInstallPrompt(null);
                    break;
                }

                // --- экспорт картинки
                case 'export':
                    ExportService.exportPNG( stage );
                    sound.playExport();
                    break;

                // --- сохранение прокта
                case 'save':
                    StorageService.save( stage );
                    sound.playSave();
                    break;

                // --- загрузка проекта
                case 'load': {
                    const loaded = await StorageService.load( stage );
                    if ( loaded ) {
                        layersPanel.render();
                        switchLayerForTools(stage.activeLayer)
                    }
                    break;
                }

                // --- новый проект
                case 'new':
                    createNewProject();
                    break;

                // --- шаринг открытки
                case 'share-image': {
                    try {
                        // загружаем картинку на сервер через AJAX, получаем ссылку
                        const url =
                        await ShareService.shareImage(stage);
                        // console.log('url:', url);
                        await ShareUi.share(url, 'Ссылка на открытку скопирована')
                        // alert('Ссылка на картинку скопирована: ' + url);
                    } catch (error) {
                        // пользователь отмени шаринг - это не ошибка
                        if ( error.name === 'AbortError' ) return;
                        alert('Ошибка: ' + error.message);
                    }
                    console.log('Ссылка на шаринг картинки сформирована');
                    break;
                }
                // --- шаринг проекта
                case 'share-project':
                    try {
                        const url =
                        await ShareService.shareProject(stage);
                        await ShareUi.share(url, 'Ссылка на проект скопирована');
                    } catch (error) {
                        if ( error.name === 'AbortError' ) return;
                        alert('Ошибка: ' + error.message);
                    }
                    console.log('Ссылка на шаринг проекта сформирована');
                    break;
            }
        });

    }
}