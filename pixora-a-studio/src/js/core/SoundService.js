'use strict';

// SoundService - звуковое сопровождение действий + виброотклик
// использует Web Audio API для звуков и Vibration API для вибрации
export class SoundService {
    
    constructor() {
    // AudioContext - движок для генерации и воспроизведения звуков
    // создаём лениво (браузер требует user gesture)
        this._ctx = null;

        // флаг: включён ли звук
        this.enabled = true;
    }

    // ленивая инициализация AudioContext
    // браузер не даст создать контекст до первого клика пользователя
    _getContext(){
        if ( !this._ctx ) {
            this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this._ctx;
    }

    // проигрываем короткий тон (бип)
    // frequency - частота в герцах, duration - длительность в секундах
    _playTone(frequency, duration, type = 'sine') {
        if ( !this.enabled ) return;

        const ctx = this._getContext();

        // OscillatorNode - генератор звуковой волны
        const oscillator = ctx.createOscillator();
        oscillator.type = type; // тип волны: sine, square
        oscillator.frequency.value = frequency;

        // GainNode - контроль громкости
        const gain = ctx.createGain();
        gain.gain.value = 0.15; // тихий звук, не раздражает

        // плавное затухание к концу
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        // соеденяем: генератор -> громкость -> динамик
        oscillator.connect(gain);
        gain.connect(ctx.destination);

        // запускаем и останавливаем
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }

    // вибрация (если поддерживается устройством)
    _vibrate(pattern) {
        if ( !this.enabled ) return;
        if ( navigator.vibrate ) {
            navigator.vibrate(pattern);
        }
    }

    // === Звуки для действий ===

    // начало рисования (мягкий клик)
    playDrawStart() {
        this._playTone(100, 0.05, 'sine');
        this._vibrate(10);
    }

    // конец штриха
    playDrawEnd() {
        this._playTone(200, 0.03, 'sine');
    }

    // переключение инструмента
    playToolSwitch() {
        this._playTone(1000, 0.08, 'triangle');
        this._vibrate(15);
    }

    // добаааавление слоя
    playLayerAdd() {
        this._playTone(1200, .01, 'sine');
        this._vibrate(20);
    }

    // удаление слоя
    playLayerDelete() {
        this._playTone(300, 0.15, 'sawtooth');
        this._vibrate([20, 50, 20]);
    }

    // undo
    playUndo() {
        this._playTone(300, 0.08, 'triangle');
        this._vibrate(10);
    }

    // redo
    playRedo() {
        this._playTone(200, 0.08, 'triangle');
        this._vibrate(10);
    }

    // сохранение
    playSave() {
        this._playTone(900, 0.06, 'sine');
        this._playTone(1200, 0.06, 'sine');
        this._vibrate(30);
    }

    // экспорт
    playExport() {
        this._playTone(1000, 0.1, 'sine');
        this._vibrate(40);
    }

    // ощибка
    playError() {
        this._playTone(200, 0.2, 'square');
        this._vibrate([50, 30, 50]);
    }
}

// Web Audio API — браузерный движок для генерации/обработки звука
// AudioContext — главный объект, управляет звуковым графом
// OscillatorNode — генератор волны (бипы, тоны)
// GainNode — регулятор громкости
// Vibration API — navigator.vibrate() — вибрация на мобилках