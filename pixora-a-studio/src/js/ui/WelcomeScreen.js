'use strict';

// WelcomeScreen - приветственный экран при загрузке приложения
export class WelcomeScreen {

    static show($stage) {
        return new Promise((resolve) => {
            // скрываем togglr на мобиле в окне приветствия
            const $toggle = document.querySelector('.layers-panel__toggle');
            if ( $toggle ) $toggle.style.display = 'none';

            // создаём оверлей
            const el = document.createElement('div');
            el.className = 'stage__welcome';

            el.innerHTML = `
                <h2 class="stage__welcome-title">Pixora A. Studio</h2>
                <p class="stage__welcome-text">
                    🎨 Рисуй и создавай открытки<br>
                    📸 Добавляй фото, стикеры и разукрашки<br>
                    🔗 Делись ссылкой — друг откроет в браузере<br>
                    ✏️ Отправь проект другу — он продолжит рисовать<br>
                    💾 Скачай готовую картинку
                </p>
                <button class="stage__welcome-btn">&diams; Создать проект</button>
                <p class="stage__welcome-hint">или нажми Ctrl+M</p>
            `;

            $stage.append(el);

            // общий обработчик закрытия
            function close() {
                if ( $toggle ) $toggle.style.display = '';
                el.remove();
                resolve();
            }

            // закрытие по кнопке
            el.querySelector('.stage__welcome-btn')
                .addEventListener('click' , close);

            // закрытие по Crtl+M -> init продолжает -> createNewProject
            document.addEventListener('keydown', function onKey(e) {
                if ( e.ctrlKey && (e.key === 'm' || e.key === 'ь') ) {
                    e.preventDefault();
                    document.removeEventListener('keydown', onKey);
                    close();
                }
            });
        });
    }
}