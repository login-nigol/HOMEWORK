// всегда работает в strict(строгом) режиме
import { formatDateTime } from './formatDateTime.js';

// константы без магии), градусы поворота за одну единицу времени
// SECOND_DEG - градус поворота секундной стрелки 6°
// 360° / 60 секунд = 6° одна секунда
// MINUTES_DEG - аналагично для минут = 6° (частота обновления минута)
// HOUR_DEG - градус поворота часовой стрелки 30°
// 360° / 12 = 30° один час, в функции опишем плавность поворота стрелки
const SECOND_DEG = 360 / 60; // 6°
const MINUTE_DEG = 360 / 60; // 6°
const HOUR_DEG = 360 / 12;   // 30°

// цепляем DOM элементы
const secondHand = document.querySelector('.second');
const minuteHand = document.querySelector('.minute');
const hourHand = document.querySelector('.hour');
const digitalClock = document.querySelector('#digital-clock');


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
    // (hour + minute / 60) * HOUR_DEG - плавность
    // minute / 60 - доля часа
    // hour + minute/60 - реальное положение часовой стрелки между делениями
    // стрелка двигается не скачками раз в час, а плавно смещается каждую минуту

    // обновляем цифровое время на циферблате
    digitalClock.textContent =
        String(hour).padStart(2, '0') + ':' +
        String(minute).padStart(2, '0') + ':' +
        String(second).padStart(2, '0');
}


// цепляем элементы управления сборкой часов
const controls = document.querySelector('#controls');
const diametrInput = document.querySelector('#diametrInput')
const buildBtn = document.querySelector('#buildBtn');

// цепляем механические часы
const mechanicalClock = document.querySelector('#clock');

// SVG с цифрами (файл через <object>) — с ним можно работать только после load
const clockNumberObj = document.querySelector('#clockNumber'); // <object>
const SVG_NS = 'http://www.w3.org/2000/svg';

// координатная система viewBox 0..100, центр в (50,50)
const SVG_CENTER_X = 50;
const SVG_CENTER_Y = 50;
const NUMBERS_RADIUS  = 41;       // радиус размещения цифр (под окружность)
const NUMBERS_CIRCLE_RADIUS = 6;  // радиус кружка под цифрой
const TEXT_OFFSET_Y = '0.1em';    // микросдвиг текста в кружке вниз


// создаём цифры 1-12 в кружках внутри SVG
function buildSvgNumbers() {
    const svgDoc = clockNumberObj.contentDocument; // доступ к DOM внутри svg-файла
    const numbersGroup = svgDoc.querySelector('#numbers'); // <g id="numbers"></g> в svg   

    // на случай повторной сборки — чистим группу
    numbersGroup.innerHTML = '';    
    
    for ( let hour =1; hour <=12; hour++ ) {
        const angleRad = (hour * HOUR_DEG) * Math.PI / 180; // градусы -> радианы
        
        // x через sin, y через -cos (чтобы 12 было сверху)
        const x = SVG_CENTER_X + NUMBERS_RADIUS * Math.sin(angleRad);
        const y = SVG_CENTER_Y - NUMBERS_RADIUS * Math.cos(angleRad);
        
        // кружок под цифрой
        const c = svgDoc.createElementNS(SVG_NS, 'circle');
        c.setAttribute('class', 'num-circle');
        c.setAttribute('cx', x);
        c.setAttribute('cy', y);
        c.setAttribute('r', NUMBERS_CIRCLE_RADIUS);
        numbersGroup.appendChild(c);
        
        // цифра в кружке
        const t = svgDoc.createElementNS(SVG_NS, 'text');
        t.setAttribute('class', 'num-text');
        t.textContent = hour;
        t.setAttribute('x', x);
        t.setAttribute('y', y);
        t.setAttribute('dy', TEXT_OFFSET_Y);
        numbersGroup.appendChild(t);
    }
}

// 

// ждём пока свг подгрузится
clockNumberObj.addEventListener('load', buildSvgNumbers);

// обработчик события клавиатуры
diametrInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // чтобы не было лишних действий
        buildBtn.click();   // запускаем сборку
    }
});

// диапозон размера диаметра циферблата от 12 до 50 (em)
const MIN_DIAMETER = 12;
const MAX_DIAMETER = 50;
const TIMER_INTERVAL = 1000; // в милисекундах

// чтобы не запускать часы несколько раз
let timerId = null;

// обработчик события клика кнопки «Собрать часы»
buildBtn.addEventListener('click', ()=> {
    const diameter = Number(diametrInput.value);
    
    if ( diameter < MIN_DIAMETER || diameter > MAX_DIAMETER ) {
        alert('Введите число от 12 до 50!')
        return;
    }
    
    // применяем диаметр циферблата
    mechanicalClock.style.width = `${diameter}em`;
    mechanicalClock.style.height = `${diameter}em`;
    
    // прячем управление, показываем часы
    controls.style.display = 'none';
    mechanicalClock.hidden = false; 

    // защита от повторного сбора часов
    if ( timerId ) clearInterval( timerId );

    // сборка часов: сразу выставляем текущее время + интервал обновления
    updateTime();
    timerId = setInterval(updateTime, TIMER_INTERVAL);
    
});



// === проверка вращения === //
// let angleSec = 0;
// setInterval(()=> {
//     angleSec +=6; 
//     secondHand.style.transform = 
//     `translateX(-50%) rotate(${angleSec}deg)`;
// }, 1000);