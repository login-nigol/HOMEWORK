'use strict';

// LayersPanelUi - рендерит список слоёв и обрабатывает кнопки управления
// связывает Stage (данные) с DOM (отображение)
export class LayersPanelUi {
    constructor(stage, $list, $btns, onChange, sound) {
        // ссылка на сцену - источник данных о слое
        this.stage = stage;
        
        // DOM-элемент <ul> - сюда рендерим список
        this.$list = $list;
        
        // колбэк - вызываем когда активный слой изменился
        // main.js передаёт сюда функцию для переключения инструментов
        this._onChange = onChange;
        this.sound = sound;

        // навешиваем обработчики на кнопки управления
        $btns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this._onAction(e.currentTarget.dataset.action);
            });
        });
    }

    // рендерим список слоёв - полная перерисовка из stage.layers
    render() {
        // очищаем список
        this.$list.innerHTML = '';

        // прооходим по всем слоям и создайём <li> для каждого
        this.stage.layers.forEach((layer) => {
            const li = document.createElement('li');
            li.classList.add('layer-item');

            // подсветка активного слоя
            if ( layer === this.stage.activeLayer ) {
                li.classList.add('layer-item--active');
            }

            // иконки: видимость + тип слоя
            const icon = layer.visible ? '👁️' : '🚫';
            const typeIcon = layer.type === 'image' ? '🖼️' : '🖌️'
            li.dataset.id = layer.id;
            li.textContent = `${icon} ${typeIcon} ${layer.id}`;

            // клик элементу списка - делаем слой активным
            li.addEventListener('click', (e) => {
                // стопаем всплытие - панель не закроется при выборе слоя
                e.stopPropagation();

                this.stage.activeLayer = layer;

                // поднимаем canvas наверх DOM-стека
                this.stage.bringToFront(layer);

                // перерисовыем список (подсветка сменится)
                this.render();

                // уведомляем main.js о смене слоя
                this._onChange(layer);
            });

            this.$list.append(li);
        });
    }

    // обработка кнопок управления слоями
    _onAction(action) {
        const layer = this.stage.activeLayer;

        switch (action) {
            case 'add':
                this.stage.addLayer({ type: 'draw' });
                if ( this.sound ) this.sound.playLayerAdd();
                break;
        
            case 'delete':
                // не удаляем последний слой - редакто без слоёв не работает
                if ( !layer || this.stage.layers.length <= 1 ) return;
                this.stage.removeLayer(layer); 
                if ( this.sound ) this.sound.playLayerDelete();
                break;

            case 'up':
                if ( !layer ) return;
                // вверх визуально = вперёд в масстве (+1)
                this.stage.moveLayer(layer, 1);
                break;

            case 'down':
                if ( !layer ) return;

                // вниз визуально = назад в масстве (-1)
                this.stage.moveLayer(layer, -1);
                break;

            case 'toggle':
                if ( !layer ) return;
                this.stage.toggleLayer(layer);
                break;
        }

        // обновляем UI после лубого действия
        this.render();

        // уведомляем main.js - активный слой мог измениться
        this._onChange(this.stage.activeLayer);
    }
}