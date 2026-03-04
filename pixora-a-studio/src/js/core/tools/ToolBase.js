'use strict';

// ToolBase - базовый класс для всех инструментов
// овтвечает за: pointer-события, координаты, жизненый цикл (activate/deactivate)
export class ToolBase {
    constructor(layer, history) {
        // слой на котором работают инструменты
        this.layer = layer;

        // ссылка на объект истории (undo/redo)
        this.history = history; 

        // явный флаг: активвен ли инсструмент прямо сейчас
        this._isActive = false;
    }

    // переключаем инструмент на другой слой
    setLayer(newLayer) {
        // если активен - переключаем обраотчики
        if ( this._isActive ){
            this.deactivate();
            this.layer = newLayer;
            this.activate();
        } else {
            // неактивен -  просто обновляем ссылку
            this.layer = newLayer;
        }
    }

    activate() {
        //  активируем инструмент - вешаем обработчики на canvas текущего слоя
        this._isActive = true;
        const canvas = this.layer.canvas;
        
        // pointerdown - начало рисования
        this._onPointerDown = (e) => {
            console.log('layer:', this.layer);
            console.log('ctx:', this.layer?.ctx);
            console.log('canvas:', this.layer?.canvas);
            // сохраняем снинмок canvas до изменений (для undo)
            if ( this.history ) {
                this.history.save(this.layer);
            }
            
            // переводим координаты мыши в координаты canvas
            const { x, y } = this._getCoords(e);

            // применяем настройки инструмента (цвет, размер)
            this.applySettings();

            // говорим слою: начинай рисовать
            this.layer.startDrawing(x, y);
        };

        // pointermove - движение мыши/пальца
        this._onPointerMove = (e) => {
            const { x, y } = this._getCoords(e);
            this.layer.draw(x, y);
        };

        // pointerup - отпустили кнопку / убрали палец
        this._onPointerUp = () => {
            this.layer.stopDrawing();
            // хук для наследников (например ластик сбрасывает compositeOperation)
            this._afterStroke();
        };

        // pointerleave - при уходе за пределы canvas, останавливаем рисование
        this._onPointerLeave = () => {
            this.layer.stopDrawing();
            this._afterStroke();
        }

        // навешиваем обработчики на canvas
        canvas.addEventListener('pointerdown', this._onPointerDown);
        canvas.addEventListener('pointermove', this._onPointerMove);
        canvas.addEventListener('pointerup', this._onPointerUp);
        canvas.addEventListener('pointerleave', this._onPointerLeave);
    }
    
    // деактивируем инструмент - снимаем все обработчики с canvas
    // и сбрасваем флаг
    deactivate() {
        this._isActive = false;
        const canvas = this.layer.canvas;
        
        // снимаем обработчики
        canvas.removeEventListener('pointerdown', this._onPointerDown);
        canvas.removeEventListener('pointermove', this._onPointerMove);
        canvas.removeEventListener('pointerup', this._onPointerUp);
        canvas.removeEventListener('pointerleave', this._onPointerLeave);

        // обнкляем ссылки- чтобы не было призраков
        this._onPointerDown = null;
        this._onPointerMove = null;
        this._onPointerUp = null;
        this._onPointerLeave = null;
    }

    // хук после завершения штриха 
    // пустой в базовом классе - переопределяют наследники если нужно
    // например ластик сбрасывает globalCompositeOperation обратно
    _afterStroke() {}

    // переопределяется в наследниках - настройки конкретного инструмента
    applySettings() {
        throw new Error('applySettings() должен быть реализован в наследнике');
    }

    // пересчитывает координаты мыши в координаты canvas
    // нужно потому что CSS-размер canvas != его реальный размер в пикселях
    _getCoords(e) {
        const canvas = this.layer.canvas;

        // rect - положение и CSS-размер canvas на экране
        const rect = canvas.getBoundingClientRect();

        // коофициенты масштаба: реальные пиксели / CSS-пиксели
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            // (позиция мыши на экране - отступ canvas) * мастаб
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }
}