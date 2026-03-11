'use strict';

// ShareUi - UI-обёртка над шарингом
// определяет способ передачи ссылки в зависимости от платформы:
// iOS/Android/Chrome - нативный Web Share API (шит выбора приложения)
// Firefox desctop - clipboard API (копирование в буфер)
export class ShareUi {

    // унивирсальный метод шаринга ссылки
    // принимает url и текст для alert на десктопе
    static async share(url, alertText) {
        if ( navigator.share ) {
            // пользователь сам выбирает куда отправить
            await navigator.share({ url });
        } else {
            // fallback для Firefox desctop
            await navigator.clipboard.writeText(url);
            alert(alertText + ': ' + url);
        }
    }
}