'use strict';

// ShareUi - UI-обёртка над шарингом
// определяет способ передачи ссылки в зависимости от платформы:
// iOS/Android/Chrome - нативный Web Share API (шит выбора приложения)
// Firefox desctop - clipboard API (копирование в буфер)
export class ShareUi {
    // унивирсальный метод шаринга ссылки
    // принимает url и текст для alert на десктопе
    static async share(url, alertText) {
        // navigator.share на мобиле - нативный шит
        // на десктопе - копируем в буфер
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if ( isMobile && navigator.share ) {
            try {
                // пользователь сам выбирает куда отправить
                // iOS, Android, Chrome/Edge desctop на https
                await navigator.share({ url });                
            } catch (error) {
                if ( error.name === 'AbortError' ) return;
                // fallback - копируем в буфер
                await navigator.clipboard.writeText(url);
                alert(alertText + ': ' + url);
            }
        } else {
            // fallback для Firefox desctop - копируем в буфер
            await navigator.clipboard.writeText(url);
            alert(alertText + ': ' + url);
        }
    }
}