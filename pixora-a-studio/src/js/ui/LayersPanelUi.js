'use strict';

// LayersPanelUi - рендерит список слоёв и управлет панелью
export class LayersPanelUi {
    constructor(stage, $list, $btns, onChange) {
        this.stage = stage;
        this.$list = $list;
        this._onChange = onChange; // вызываем когда активный слой меняется

        // навешиваем обработчики на кнопки управления
        $btns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                this._onAction(e.currentTarget.dataset.action);
            });
        });
    }

    // рендерим список слоёв из stage.layers
    render() {
        this.$list.innerHTML = '';

        this.stage.layers.forEach((layer) => {
            const li = document.createElement('li');
            li.classList.add('layer-item');

            // подсветка активного слоя
            if ( layer === this.stage.activeLayer ) {
                li.classList.add('layer-item--active');
            }

            // показываем статус видимости
            const icon = layer.visible ? '👁️' : '🚫';
            const typeIcon = layer.type === 'image' ? '🖼️' : '🖌️'
            li.dataset.id = layer.id;
            li.textContent = `${icon} ${typeIcon} ${layer.id}`;

            // клик по слою - делаем активным
            li.addEventListener('click', () => {
                this.stage.activeLayer = layer;
                this.stage.bringToFront(layer);
                this.render();
                this._onChange(layer);
            });

            this.$list.append(li);
        });
    }

    // обработка действий кнопок
    _onAction(action) {
        const layer = this.stage.activeLayer;

        switch (action) {
            case 'add':
                this.stage.addLayer({ type: 'draw' });
                break;
        
            case 'delete':
                if ( !layer || this.stage.layers.length <= 1 ) return; // не удаляем последний
                this.stage.removeLayer(layer); 
                break;

            case 'up':
                if ( !layer ) return;
                this.stage.moveLayer(layer, 1); // вверх в стеке = вперёд в масстве
                break;

            case 'down':
                if ( !layer ) return;
                this.stage.moveLayer(layer, -1); // вниз в стеке = назад в масстве
                break;

            case 'toggle':
                if ( !layer ) return;
                this.stage.toggleLayer(layer);
                break;
        }

        this.render();
        this._onChange(this.stage.activeLayer);
    }
}