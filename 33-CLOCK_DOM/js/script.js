'use strict';
import { formatDateTime } from './formatDateTime.js';

// 1 - константы
// 2 - DOM селекторы
// 3 - Создание динамических элементов
// 4 - функции
// 5 - навешивание обработчиков

// SECOND_DEG - градус поворота секундной стрелки 6° = 360° / 60 секунд, частота секунда
// MINUTES_DEG = 6° (частота обновления минута)
// HOUR_DEG - градус поворота часовой стрелки 30° = 360° / 12
// в функции опишем плавность поворота стрелки
// константы без магии), градусы поворота за одну единицу времени
const SECOND_DEG = 360 / 60; // 6°
const MINUTE_DEG = 360 / 60; // 6°
const HOUR_DEG = 360 / 12;   // 30°
// коэффициент перевода градусов в радианы
const DEG_TO_RAD = Math.PI / 180;

// DOM-селекторы: 
// цепляем DOM элементы управления сборкой часов
const controls = document.querySelector('#controls');
const diametrInput = document.querySelector('#diametrInput')
const buildBtn = document.querySelector('#buildBtn');
// элементы часов
const mechanicalClock = document.querySelector('#mechanical-clock');
const secondHand = document.querySelector('.second');
const minuteHand = document.querySelector('.minute');
const hourHand = document.querySelector('.hour');
const numbersWrap = document.querySelector('#numbers');
const digitalClock = document.querySelector('#digital-clock');

// Объявление функций:
// основная логика
function updateTime() {
    const timeNow = new Date();

    const second = timeNow.getSeconds();
    const minute = timeNow.getMinutes();
    const hour = timeNow.getHours();

    // показываю в консоли
    console.log(formatDateTime(timeNow));

    secondHand.style.transform = 
        `translateX(-50%) rotate(${second * SECOND_DEG}deg)`;
    minuteHand.style.transform =
        `translateX(-50%) rotate(${minute * MINUTE_DEG}deg)`;
    hourHand.style.transform =
        `translateX(-50%) rotate(${(hour + minute / 60) * HOUR_DEG}deg)`;
    // hour + minute/60 - реальное положение часовой стрелки между делениями
    // minute / 60 - доля часа
    // ( ... ) * HOUR_DEG - плавность
    // стрелка двигается не скачками раз в час, а плавно смещается каждую минуту

    // обновляем цифровое время на циферблате
    digitalClock.textContent =
    String(hour).padStart(2, '0') + ':' +
    String(minute).padStart(2, '0') + ':' +
    String(second).padStart(2, '0');
}

// коофиценты для разметки цифр от радиуса циферблата
const NUMBERS_RADIUS_K = 0.85;  // позиционирование от центра
const NUM_CIRCLE_DIAM_K = 0.22; // размер кружков цифр
const NUM_FONT_SIZE_K = 0.13;   // размер цифр
const NUM_TEXT_OFFSET_K = 0.05; // вертикальный микросдвиг цифр

// Функция-обработчик:
// встраиваю DOM-цифры в сборку часов
function buildDomNumbers() {
    const rect = mechanicalClock.getBoundingClientRect();

    // центр в часах
    const clockCenterX = rect.width / 2;
    const clockCenterY = rect.height / 2;
    const clockRadius = rect.width / 2;

    // радиус размещения цифр и диаметр кружка цифры
    const numbersR = clockRadius * NUMBERS_RADIUS_K;
    const circleD = clockRadius * NUM_CIRCLE_DIAM_K;

    numbersWrap.innerHTML = '';

    // 12 часов в обороте
    for (let hour=1; hour<=12; hour++) {
        // hour * 30° -> переводим градусы в радианы
        const angleRad = hour * HOUR_DEG * DEG_TO_RAD;

        // координаты центра цифры по окружности
        const numCenterX = clockCenterX + numbersR * Math.sin(angleRad);
        const numCenterY = clockCenterY - numbersR * Math.cos(angleRad);

        // создаём DOM-элемент цифры
        const numberEl = document.createElement('div');
        numberEl.className = 'clock-num';
        numberEl.textContent = hour;
        numberEl.style.lineHeight = '1';
        numberEl.style.paddingTop = `${clockRadius * NUM_TEXT_OFFSET_K}px`;

        // размеры кружка
        numberEl.style.width = `${circleD}px`;
        numberEl.style.height = `${circleD}px`;

        // позиционирую цифру по её центру
        numberEl.style.left = `${numCenterX}px`;
        numberEl.style.top = `${numCenterY}px`;
        numberEl.style.transform = 'translate(-50%, -50%)';

        // размер шрифта от радиуса часов
        numberEl.style.fontSize = `${clockRadius * NUM_FONT_SIZE_K}px`;

        numbersWrap.appendChild(numberEl);
    }    
}
// buildDomNumbers();

// диапозон размера диаметра циферблата от 12 до 50 (em)
const MIN_DIAMETER = 200;
const MAX_DIAMETER = 800;
const TIMER_INTERVAL = 1000; // в милисекундах

let timerId = null; // чтобы не запускать часы несколько раз

// Обработчики событий:
// обработчик события клика кнопки
buildBtn.addEventListener('click', ()=> {
    const diameter = Number(diametrInput.value);
    
    if ( diameter < MIN_DIAMETER || diameter > MAX_DIAMETER ) {
        alert('Введите число от 200 до 800!')
        return;
    }
    
    // применяем диаметр циферблата
    mechanicalClock.style.width = `${diameter}px`;
    mechanicalClock.style.height = `${diameter}px`;
    
    // прячем управление, показываем часы
    controls.style.display = 'none';
    mechanicalClock.hidden = false;

    // даём браузеру применить размеры, потом строим цифры
    requestAnimationFrame(()=>{
        buildDomNumbers();
    });
    
    // защита от повторного сбора часов
    if ( timerId ) clearInterval( timerId );    
    
    // сборка часов: сразу выставляем текущее время + интервал обновления
    updateTime();
    buildDomNumbers();
    timerId = setInterval(updateTime, TIMER_INTERVAL);
});
// опционально
// buildDomNumbers();
// timerId = setInterval(updateTime, TIMER_INTERVAL);

// обработчик события клавиатуры
diametrInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // чтобы не было лишних действий
        buildBtn.click();
    }
});
