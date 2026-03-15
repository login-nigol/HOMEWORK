'use strict';

// GestureHandler - обработка жестов на тачскрине
// pan (2 пальца) - перемещение холста
// pinch (2 пальца) - масштабирование холста
// использует Pointer Events (не touch events)
export class GestureHandler {

    // принимаем $stageStack и колбэки зума из main.js
    constructor($container, onZoom, getZoom) {
        this._container = $container;
        this._onZoom = onZoom;   // колбэк: applyZoom()
        this._getZoom = getZoom; // колбэк: () => zoomLevel

        // хранилище активных указателей (пальцев)
        this._pointers = new Map();

        // начальное расстояние между пальцами (для pinch)
        this._initDistance = null;

        // начальный зум (для pinch)
        this._initZoom = null;

        // начальная середина между пальцами (для pan)
        this._initMidX = null;
        this._initMidY = null;

        // начальная позиция холста (для pan)
        this._initLeft = null;
        this._initTop = null;

        this._bindEvents();
    }

    // === приватные методы ===

    // расстояние между двумя указателями
    _getDistance(a, b) {
        const dx = a.clientX - b.clientX;
        const dy = a.clientY - b.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // середина между двумя указателями
    _getMidpoint(a, b) {
        return {
            x: (a.clientX + b.clientX) / 2,
            y: (a.clientY + b.clientY) / 2,
        };
    }

    _bindEvents() {
        const el = this._container;

        // pointerdown - добавляем палец в Map
        el.addEventListener('pointerdown', (e) => {
            this._pointers.set(e.pointerId, e);

            // когда второй палец - блокируем рисование
            if ( this._pointers.size === 2 ) {
                e.stopImmediatePropagation();
            }
        });

        // pointermove - обрабатываем жест
        el.addEventListener('pointermove', (e) => {
            // обновляем указатель в Map
            if ( !this._pointers.has(e.pointerId) ) return;
            this._pointers.set(e.pointerId, e);

            // два пальца - останавливаем рисование
            if ( this._pointers.size === 2 ) {
                e.stopImmediatePropagation(); // блокируем pointermove для ToolBase
            }

            // жест только двумя пальцами
            if ( this._pointers.size !== 2 ) return;

            const [a, b] = [...this._pointers.values()];

            // === инициализация жеста ===
            if ( this._initDistance === null ) {
                this._initDistance = this._getDistance(a, b);
                this._initZoom = this._getZoom();

                const mid = this._getMidpoint(a, b);
                this._initMidX = mid.x;
                this._initMidY = mid.y;

                // текущая позиция холста
                this._initLeft = parseInt(this._container.style.left) || 0;
                this._initTop = parseInt(this._container.style.top) || 0;
                return;
            }

            // === pinch-scale ===
            const currentDistance = this._getDistance(a, b);
            const scale = currentDistance / this._initDistance;
            const newZoom = Math.round(this._initZoom * scale * 100) / 100;

            // передаём новый зум в main.js
            this._onZoom(newZoom);

            // === pan ===
            const mid = this._getMidpoint(a, b);
            const dx = mid.x - this._initMidX;
            const dy = mid.y - this._initMidY;

            this._container.style.left = (this._initLeft + dx) + 'px';
            this._container.style.top  = (this._initTop  + dy) + 'px';
        });

        // pointerup/leave - убираем палец из Map
        const onEnd = (e) => {
            this._pointers.delete(e.pointerId);

            // сбрасываем жест когда пальцев меньше 2
            if ( this._pointers.size < 2 ) {
                this._initDistance = null;
                this._initZoom = null;
                this._initMidX = null;
                this._initMidY = null;
                this._initLeft = null;
                this._initTop = null;
            }
        };

        el.addEventListener('pointerup', onEnd);
        el.addEventListener('pointerleave', onEnd);
        el.addEventListener('pointercancel', onEnd);
    }
}