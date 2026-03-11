'use strict';

// CanvasDialog - диалог выбора размера холста при старте
export class CanvasDialog {

    // показываем диалог и возвращаем Promise с выбраным размером
    static show() {
        // console.log('CanvasDialog.show вызван');
        return new Promise((resolve) => {
            // создаём оверлей
            const overlay = document.createElement('div');
            overlay.className = 'canvas-dialog';

            overlay.innerHTML = `
                <div class="canvas-dialog__box">
                    <!-- кнопка закрытия -->
                    <button class="canvas-dialog__close">
                        <svg><use href="#icon-cross"></use></svg>
                    </button>
                    <h2 class="canvas-dialog__title">Новый проект</h2>
                    <p class="canvas-dialog__subtitle">Выберите ориентацию холста</p>
                    <div class="canvas-dialog__options">
                        <button class="canvas-dialog__btn" data-w="600" data-h="800">
                            <span class="canvas-dialog__icon canvas-dialog__icon--portrait"></span>
                            <span>Портрет</span>
                            <span class="canvas-dialog__size">600 &times; 800</span>
                        </button>
                        <button class="canvas-dialog__btn" data-w="800" data-h="600">
                            <span class="canvas-dialog__icon canvas-dialog__icon--landscape"></span>
                            <span>Ландшафт</span>
                            <span class="canvas-dialog__size">800 &times; 600</span>
                        </button>
                    </div>
                </div>
            `;

            document.body.append(overlay);

            // клик по кнопке - возвращаем размер и закрываем
            overlay.querySelectorAll('.canvas-dialog__btn').forEach((btn) => {
                btn.addEventListener('click', () => {

                    // console.log('outerHTML:', e.currentTarget.outerHTML);
                    // console.log('dialog btn clicked', e.currentTarget.dataset);

                    const w = Number(btn.dataset.w);
                    const h = Number(btn.dataset.h);
                    // console.log('removing overlay, w:', w, 'h:', h);
                    overlay.remove();
                    resolve({ w, h });
                });
            });

            // закрытие по крестику
            overlay.querySelector('.canvas-dialog__close')
                .addEventListener('click' , () => {
                    overlay.remove();
                    resolve(null);
                });

            // закрытие по клику вне окна
            overlay.addEventListener('click', (e) => {

                // console.log('dialog btn clicked', e.currentTarget.dataset);

                if ( e.target === overlay ) {
                    overlay.remove();
                    resolve(null);
                }
            });
        });
    }
}