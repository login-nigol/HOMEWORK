// сборка часов
// вызов скрипта
// import { buildClock } from './buildClock.js';
'use strict'

// углы для цифр    
const DEG_TO_RAD = Math.PI / 180; // коэффициент перевода градусов в радианы
const HOUR_DEG = 360 / 12;        // 30° один час

// пространство имён SVG
const SVG_NS = 'http://www.w3.org/2000/svg';

// унивирсальный конструктор SVG-элементов
function createSvgEl(tag) {
    return document.createElementNS(SVG_NS, tag);
}

// сборка циферблата (фон-круг)
export function buildClock(rootEl, diameter) {
    // чистим контейнер
    rootEl.innerHTML = '';

    // геометрия
    const radius = diameter / 2;    
    const strokeW = radius * 0.03;       // 3% - толщина рамки циферблата
    const svgSize = diameter + strokeW;  // размер svg с учётом рамки
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    
    // === создаём <scg> ===
    const svg = createSvgEl('svg');
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);
    svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
    
    rootEl.appendChild(svg);    
    
    // === окруженсть-циферблат ===
    
    const face = createSvgEl('circle');   
    face.setAttribute('class', 'clock-face');
    // положение и размер
    face.setAttribute('cx', centerX);
    face.setAttribute('cy', centerY);
    face.setAttribute('r', radius);
    face.setAttribute('stroke-width', strokeW);
    
    
    // === секундная стрелка ===
    
    // размеры пропорционально радиусу
    const secW = radius * 0.015;    // 1.5% - ширина стрелки
    const secH = radius * 0.80;    // 80% - длина стрелки
    const secTail = radius * 0.15; // 15% хвостик вниз, аналог ::befor
    
    // рисую как линию, ось вращения = центр часов
    const secondHand = createSvgEl('line');
    secondHand.setAttribute('id', 'secondHand');
    secondHand.setAttribute('class', 'secondHand');    
    // начало линии (хвостик вниз от центра)
    secondHand.setAttribute('x1', centerX);
    secondHand.setAttribute('y1', centerY + secTail);
    // конец линии (вверх от центра)
    secondHand.setAttribute('x2', centerX);
    secondHand.setAttribute('y2', centerY - secH);    
    // ширина стрелки
    secondHand.setAttribute('stroke-width', secW);
    
    // === минутная стрелка ===
    
    // размеры пропорционально радиусу
    const minW = radius * 0.05;    // 5% - ширина стрелки
    const minH = radius * 0.65;    // 65% - длина стрелки
    const minTail = radius * 0.13; // 13% хвостик вниз, аналог ::befor
    
    // рисую как линию, ось вращения = центр часов
    const minuteHand = createSvgEl('line');
    minuteHand.setAttribute('id', 'minuteHand');
    minuteHand.setAttribute('class', 'minuteHand');    
    // начало линии (хвостик вниз от центра)
    minuteHand.setAttribute('x1', centerX);
    minuteHand.setAttribute('y1', centerY + minTail);
    // конец линии (вверх от центра)
    minuteHand.setAttribute('x2', centerX);
    minuteHand.setAttribute('y2', centerY - minH) ;    
    // ширина стрелки
    minuteHand.setAttribute('stroke-width', minW);

    // === часовая стрелка ===
    
    // размеры пропорционально радиусу
    const hourW = radius * 0.05;    // 5% - ширина стрелки
    const hourH = radius * 0.50;    // 50% - длина стрелки
    const hourTail = radius * 0.10; // 10% хвостик вниз, аналог ::befor
    
    // праямоугольник, ось вращения = центр часов
    const hourHand = createSvgEl('rect');
    hourHand.setAttribute('id', 'hourHand');
    hourHand.setAttribute('class', 'hourHand');    
    // левый верхний угол
    hourHand.setAttribute('x', centerX - hourW / 2);
    hourHand.setAttribute('y', centerY - hourH);
    // размер
    hourHand.setAttribute('width', hourW);
    hourHand.setAttribute('height', hourH + hourTail);
    // скругление краёв - border-radius
    hourHand.setAttribute('rx', hourW * 0.6);
    hourHand.setAttribute('ry', hourW * 0.6);

    // === болтик ===

    const boltR = radius * 0.06; // 6% - радиус

    const bolt = createSvgEl('circle');
    bolt.setAttribute('class', 'bolt');
    bolt.setAttribute('cx', centerX);
    bolt.setAttribute('cy', centerY);
    bolt.setAttribute('r', boltR);

    // === звезда ===

    // позиция: выше центра на 25% радиуса
    const starX = centerX;
    const starY = centerY - radius * 0.45;

    // размер звезды
    const starR = radius * 0.10; // 10%

    // простая звезда как polygon (5 лучей)
    const star = createSvgEl('polygon');
    star.setAttribute('class', 'clock-star');
    // точки звезды (относительно центра звезды)
    const points = [
    [0, -1], [0.22, -0.3], [1, -0.3],
    [0.36, 0.1], [0.6, 0.8],
    [0, 0.35], [-0.6, 0.8],
    [-0.36, 0.1], [-1, -0.3],
    [-0.22, -0.3]
    ].map(p =>
    `${starX + p[0] * starR},${starY + p[1] * starR}`
    ).join(' ');
    star.setAttribute('points', points);
    
    // === цифры 1–12 (кружок + текст) ===    

    const numbersR = radius * 0.80;     // 80% радиус орбиты на котором стоят цифры
    const numCircleR = radius * 0.13;   // 13% радиус кружка
    const fontSize = radius * 0.20;     // 20% размер шрифта    

    for ( let hour=1; hour<=12; hour++ ) {
        // угол: 1..12 -> 30° = 360° / 12часов
        const angleRad = ( hour * HOUR_DEG ) * DEG_TO_RAD;

        // координаты по окружности (sin/cos)
        const x =centerX + numbersR * Math.sin(angleRad);
        const y =centerY - numbersR * Math.cos(angleRad);

        // кружок под цифру
        const ring = createSvgEl('circle');
        ring.setAttribute('class', 'clock-number-ring');
        ring.setAttribute('cx', x);
        ring.setAttribute('cy', y);
        ring.setAttribute('r', numCircleR);

        svg.appendChild(ring);

        // цифры
        const text = createSvgEl('text');
        text.setAttribute('class', 'clock-number-text');
        text.textContent = hour;
        text.setAttribute('x', x);
        text.setAttribute('text-anchor', 'middle');
        // text.setAttribute('dominant-baseline', 'middle'); // не с текстом!
        // оптическое центрирование: fontSize * 0.33 - 33% от высоты шрифта
        text.setAttribute('y', y + fontSize * 0.33);
        text.setAttribute('font-size', fontSize);

        svg.appendChild(text);
    }

    // === digital-часы с рамкой ===

    // группа
    const digitalGroup = createSvgEl('g');
    // размеры рамки
    const boxW = radius * 0.58;  // 60% - ширина рамки
    const boxH = radius * 0.14; // 15% - высота
    // позиция
    const boxX = centerX - boxW / 2;
    const boxY = centerY + radius * 0.585 - boxH; // 53.5% от центра вниз
    const digClockSize = radius * 0.11 // 11% размер дигитальных часов

    // рамка
    const digitalBox = createSvgEl('rect');
    digitalBox.setAttribute('class', 'digital-box');
    digitalBox.setAttribute('x', boxX);
    digitalBox.setAttribute('y', boxY);
    digitalBox.setAttribute('width', boxW);
    digitalBox.setAttribute('height', boxH);
    digitalBox.setAttribute('rx', boxH * 0.2);
    digitalBox.setAttribute('ry', boxH * 0.2);

    digitalGroup.appendChild(digitalBox);

    const digitalClock = createSvgEl('text');
    digitalClock.setAttribute('class', 'digital-clock');
    digitalClock.textContent = '00:00:00';
    // позиция (нижняя часть циферблата)
    digitalClock.setAttribute('x', centerX);
    digitalClock.setAttribute('y', centerY + radius * 0.55); // 50% - от центра вниз
    digitalClock.setAttribute('font-size', digClockSize);
    digitalClock.setAttribute('text-anchor', 'middle');

    digitalGroup.appendChild(digitalClock);
    
    svg.appendChild(face);
    svg.appendChild(digitalGroup);
    svg.appendChild(star);
    svg.appendChild(hourHand);
    svg.appendChild(minuteHand);
    svg.appendChild(secondHand);
    svg.appendChild(bolt);

// набор ссылок на созданные элементы и данные геометрии
    return { centerX, centerY, secondHand, minuteHand, hourHand, digitalClock };
}
