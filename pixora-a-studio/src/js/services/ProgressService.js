'use strict';

// ProgressService - модалка прогресса загрузки
// создаём DOM программно, показваем/скрываем при AJAX-запросах
export class ProgressService {

    // === Инициализация ===

    // создаём модалку и вешаем в body (один раз при старте)
    static init() {
        // внешний оверлей - затемняет фон
        ProgressService._modal = document.createElement('div');
        ProgressService._modal.className = 'progress-modal';
        // ProgressService._modal.hidden = true;

        // внутренний блок с контентом
        ProgressService._modal.innerHTML = `
            <div class="progress-modal__box">
                <p class="progress-modal__title" id="progressTitle">Отправка...</p>
                <div class="progress-modal__track">
                    <div class="progress-modal__bar" id="progressBar"></div>
                </div>
                <p class="progress-modal__percent" id="progressPercent">0%</p>
            </div>
        `;

        document.body.append(ProgressService._modal);

        // кешируем ссылки на элементы
        ProgressService._title = 
        ProgressService._modal.querySelector('#progressTitle');
        ProgressService._bar = 
        ProgressService._modal.querySelector('#progressBar');
        ProgressService._percent = 
        ProgressService._modal.querySelector('#progressPercent');
    }

    // === Управление ===

    // показываем модалку с заголовком
    static show(title = 'Отправка...') {
        ProgressService._title.textContent = title;
        ProgressService._bar.style.width = '0%';
        ProgressService._percent.textContent = '0%';

        ProgressService._modal.classList.add('progress-modal--open');
        // ProgressService._modal.hidden = false;
    }

    // обновляем прогресс (0-100)
    static update(percent) {
        ProgressService._bar.style.width = percent + '%';
        ProgressService._percent.textContent = percent + '%';
    }

    // прячем модалку
    static hide() {
        ProgressService._modal.classList.remove('progress-modal--open');
    }

    // === AJAX с прогрессом ===

    // отправляем FormData xthtp XHR с отслеживанием прогресса
    // переиспользуем ShareServis._request логику но с upload.onprogress
    static sendWithProgress(url, formData, title = 'Отправка...') {
        return new Promise((resolve, reject) => {
            ProgressService.show(title);
            
            const xhr = new XMLHttpRequest();

            // upload.onprogress - прогресс отправки данных на сервер
            xhr.upload.onprogress = (e) => {
                if ( e.lengthComputable ) {
                    const percent = Math.round(e.loaded / e.total * 100);
                    ProgressService.update(percent);
                }
            };

            // ответ получен - парсим JSON
            xhr.onload = () => {
                ProgressService.hide();
                try {
                    resolve(JSON.parse(xhr.responseText));
                } catch {
                    reject(new Error('Ошибка парсинга ответа'));
                }
            };

            // сетевая ошибка
            xhr.onerror = () => {
                ProgressService.hide();
                reject(new Error('Сетевая ошибка'));
            };

            xhr.open('POST', url);
            xhr.send(formData);
        });
    }
}