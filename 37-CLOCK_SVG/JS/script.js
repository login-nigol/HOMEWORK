'use strict';
import { formatDateTime } from './formatDateTime.js';
import { buildClock } from './buildClock.js';

// =====================
// константы
// =====================

// SECOND_DEG/MINUTES_DEG - градус поворота 6° = 360° / 60
// HOUR_DEG - градус поворота 30° = 360° / 12
// в функции опишем плавность поворота стрелки
// градусы поворота за одну единицу времени
const SECOND_DEG = 360 / 60; // 6°
const MINUTE_DEG = 360 / 60; // 6°
const HOUR_DEG = 360 / 12;   // 30°
// const TIMER_INTERVAL = 1000; // интерва в милисекундах

// =====================
// DOM селекторы 
// =====================

const controls = document.querySelector('#controls');
const diametrInput = document.querySelector('#diametrInput');
const buildBtn = document.querySelector('#buildBtn');

// =====================
// динамическое создание контейнеров
// =====================

// контейнер часов <div id="clock">
const clock = document.createElement('div');
clock.id = 'clock';
clock.className = 'clock';
document.body.appendChild(clock);

// =====================
// функции - основная логика
// =====================

// хранит id активного таймера для защты от повторного запуска setInterval
let timerId = null;

function updateTime() {
    const timeNow = new Date();

    const second = timeNow.getSeconds();
    const minute = timeNow.getMinutes();
    const hour = timeNow.getHours();

    // углы для стрелок
    const secAngle = second * SECOND_DEG;
    // плавность движения минутной стрелки, обновляется каждую сек
    const minAngle = (minute + second / 60) * MINUTE_DEG;
    const hourAngle = (hour + minute / 60) * HOUR_DEG;

    // вращаем стрелки
    clockObj.secondHand.setAttribute(
        'transform',
        `rotate(${secAngle} ${clockObj.centerX} ${clockObj.centerY})`
    );
    clockObj.minuteHand.setAttribute(
        'transform',
        `rotate(${minAngle} ${clockObj.centerX} ${clockObj.centerY})`
    );
    clockObj.hourHand.setAttribute(
        'transform',
        `rotate(${hourAngle} ${clockObj.centerX} ${clockObj.centerY})`
    );

    // цифровой счётчик
    clockObj.digitalClock.textContent = 
    String(hour).padStart(2, '0') + ':' +
    String(minute).padStart(2, '0') + ':' +
    String(second).padStart(2, '0');

    // лог в консоль
    console.log(formatDateTime(timeNow));
}

// =====================
// запуск / обработчики
// =====================

// диапозон размера диаметра циферблата от 12 до 50 (em)
const MIN_DIAMETER = 200;
const MAX_DIAMETER = 800;
const TIMER_INTERVAL = 1000; // в милисекундах

// объект часов
let clockObj = null;

// обработчик события кнопки
buildBtn.addEventListener('click', () => {
    const clockSize = Number(diametrInput.value);

    if ( !clockSize || clockSize < MIN_DIAMETER || clockSize > MAX_DIAMETER ) {
        alert('Введите число от 200 до 800!');
        return;
    }

    // применяем размер часов
    clock.style.width = `${clockSize}px`;
    clock.style.height = `${clockSize}px`;

    // прячу управление, показываю часы
    controls.style.display = 'none';
    // clock.hidden = false;
    
    // защита от повторного сбора часов
    if ( timerId ) clearInterval( timerId );

    // вызов сборщика (SVG)
    // buildClock фабричная функция(объектная модель)
    clockObj = buildClock(clock, clockSize);

    // для планвного появления
    clock.classList.add('is-visible');
    
    // первичный вызов - сразу запускаю
    updateTime(); 
    timerId = setInterval(updateTime, TIMER_INTERVAL);
});
// опционально
// diametrInput.value = 500;
// buildBtn.click();

// === автозапуск только для мобилы ===

const isMobile = window.innerWidth < 768;

if (isMobile) {
  const screenSize = Math.min(window.innerWidth, window.innerHeight);
  let startSize = Math.floor(screenSize * 0.95); // 95% от ширены экрана

  if (startSize < MIN_DIAMETER) startSize = MIN_DIAMETER;
  if (startSize > MAX_DIAMETER) startSize = MAX_DIAMETER;

  diametrInput.value = startSize;
  buildBtn.click(); // автосборка только на мобиле
}

// обработчик события клавиатуры
diametrInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // чтобы не было лишних действий
        buildBtn.click();
    }
});











// ===========================================================
// const {secondHand, minuteHand, centerX, centerY} = buildClock(clock, 500);
// тест ручного вращения секундной стрелки
// let testAngle = 0;

// secondHand.addEventListener('click', () => {
//   testAngle += 30;
//   secondHand.setAttribute(
//     'transform',
//     `rotate(${testAngle} ${centerX} ${centerY})`
//   );
//   minuteHand.setAttribute(
//     'transform',
//     `rotate(${testAngle} ${centerX} ${centerY})`
//   );
// });
