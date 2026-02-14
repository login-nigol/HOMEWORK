// TENNIS_CANVAS
'use strict';

// === константы ===
const FIELD_WIDTH = 640;
const FIELD_HEIGHT = 320;
const TICK_MS = 40; // 25 кадров/сек (1000/25)

// ракетки
const RACKET_WIDTH = 10;
const RACKET_HEIGHT = 80;

// скорость ракеток
const RACKET_SPEED = 6;

// размер мяча (диаметр)
const BALL_SIZE = 20;

// === DOM элементы ===
const canvas = document.getElementById('game'); // поле
const context = canvas.getContext('2d');        // 2D-контекст рисования

const btnStart = document.querySelector('.btn-start');
const scoreLeftElem = document.querySelector('.score--left');
const scoreRightElem = document.querySelector('.score--right');

// === состояние игры ===
// счёт
let scoreLeft = 0;
let scoreRight = 0;

// состояние ракеток
let leftRacketSpeed = 0;
let rightRacketSpeed = 0;

// ракетки координаты по у
let leftRacketY = (FIELD_HEIGHT - RACKET_HEIGHT) / 2;
let rightRacketY = (FIELD_HEIGHT - RACKET_HEIGHT) / 2;

// объект мяча (сохраняю координаты центра +скорось)
const ball = {
    cx: 0, // центр по х
    cy: 0, // центр по у
    vx: 0, // скорость по х
    vy: 0  // скорость по у
};

function renderScore() {
    scoreLeftElem.textContent = scoreLeft;
    scoreRightElem.textContent = scoreRight;
}

// флаг - летит ли мяч
let gameRunning = false;

// === инициализация CANVAS ===
// задаю размеры
canvas.width = FIELD_WIDTH;
canvas.height = FIELD_HEIGHT;

// === первый рендер ===
function drawField() {
    // очищаю всё полотно
    context.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

    // фон для поля
    context.fillStyle = 'lightgreen';
    context.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

    // рамка (чёткая линия: рисую по 0.5)
    context.strokeStyle = '#333';
    context.lineWidth = 1;
    context.strokeRect(0.5, 0.5, FIELD_WIDTH -1, FIELD_HEIGHT -1);

    // рисую ракетки
    drawRackets();
    // рисую мяч
    drawBall();
}

// ограничение
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function drawRackets() {
    context.fillStyle = '#333';

    // левая ракетка
    context.fillRect(
        0,
        leftRacketY,
        RACKET_WIDTH,
        RACKET_HEIGHT
    );

    // правая ракетка
    context.fillRect(
        FIELD_WIDTH - RACKET_WIDTH,
        rightRacketY,
        RACKET_WIDTH,
        RACKET_HEIGHT
    );
}

// ставлю мяч в центр поля
function setBallToCenter() {
    ball.cx = FIELD_WIDTH / 2;
    ball.cy = FIELD_HEIGHT /2;
}

// запускаю мяч
function startBall() {
    if ( gameRunning ) return; // уже летит - игнор
    btnStart.disabled = true;  // блок кнопки

    setBallToCenter();
    const amgle = Math.random() * Math.PI / 3 - Math.PI / 6; // -30..+30

    ball.vx = 5 * Math.cos(amgle);
    ball.vy = 5 * Math.sin(amgle);

    // случайное направление
    if ( Math.random() < 0.5 ) {
        ball.vx = -ball.vx;
    }
    gameRunning = true;
}

// рисую мяч по координатам центра
function drawBall() {
    context.fillStyle = 'red';

    // context.arc(); - метод Canvas, который рисует дугу или окружность
    context.beginPath();
    context.arc(
        ball.cx,
        ball.cy,
        BALL_SIZE / 2, // радиус
        0,
        Math.PI * 2
    );
    context.fill();
}

// функции стоп у стенки
function stopBallAtLeftWall() {
    ball.vx = 0;
    ball.vy = 0;
    ball.cx = BALL_SIZE / 2; // центр на касании левой стены
    gameRunning =false;
    btnStart.disabled = false; // можно стартовать снова
}

function stopBallAtRightWall() {
    ball.vx = 0;
    ball.vy = 0;
    ball.cx = FIELD_WIDTH - BALL_SIZE / 2; // центр на касании правой стены
    gameRunning = false;
    btnStart.disabled = false;
}

// функции защитать гол
function goalToLeft() { // мяч в левой стене => очко правому
    scoreRight += 1;
    renderScore();
    stopBallAtLeftWall();
}

function goalToRight() {
    scoreLeft += 1;
    renderScore();
    stopBallAtRightWall();
}

// движение tick
function tick() {
    const r = BALL_SIZE / 2;

    // всё движется если только игра идёт
    if ( gameRunning ) {

    // движение ракеток
    leftRacketY += leftRacketSpeed;
    rightRacketY += rightRacketSpeed;

    leftRacketY = clamp(leftRacketY, 0, FIELD_HEIGHT - RACKET_HEIGHT);
    rightRacketY = clamp(rightRacketY, 0, FIELD_HEIGHT - RACKET_HEIGHT);

        // движение мяча
        ball.cx += ball.vx;
        ball.cy += ball.vy;

        // отскок от левой ракетки
        if (
            ball.vx < 0 && // летит влево
            ball.cx - r <= RACKET_WIDTH && // дошел до зоны ракетки
            ball.cy + r >= leftRacketY && // пересечение по У (низ мяча ниже верха)
            ball.cy - r <= leftRacketY + RACKET_HEIGHT // пересечение по У(верх мяча выше низа)
        ) {
            ball.vx = -ball.vx; // отрожаем по Х
            // куда попали по ракетке: -1(верх)... +1(низ)
            // ударил в верх ракетки - мяч летит в верх. вниз летит вниз
            const hit = (ball.cy - (leftRacketY + RACKET_HEIGHT / 2)) / (RACKET_HEIGHT / 2);
            ball.vy += hit *2;
            ball.cx = RACKET_WIDTH + r; // выталкиваю из ракетки
        }

        // отскок от правой ракетки
        if (
            ball.vx > 0 && // летит вправо
            ball.cx + r >= FIELD_WIDTH - RACKET_WIDTH &&
            ball.cy + r >= rightRacketY &&
            ball.cy - r <= rightRacketY + RACKET_HEIGHT
        ) {
            ball.vx = -ball.vx;
            const hit = (ball.cy - (rightRacketY + RACKET_HEIGHT / 2)) / (RACKET_HEIGHT / 2);
            ball.vy += hit * 2;
            ball.cx = FIELD_WIDTH - RACKET_WIDTH - r;
        }
    
        // голы
        if ( ball.cx - r <= 0 ) {
            goalToLeft();
        } else if ( ball.cx + r >= FIELD_WIDTH ) {
            goalToRight();
        }

        // отскок У
        if ( ball.cy - r <= 0 ) {
            ball.vy = -ball.vy;
            ball.cy = r; // прижал к стенке, чтобы не залипал
        } else if ( ball.cy + r >= FIELD_HEIGHT ) {
            ball.vy = -ball.vy;
            ball.cy = FIELD_HEIGHT - r;
        }
    }
    // отрисовка всегда
    drawField();
}

// счёт
renderScore();
// ставлю мяч в центр
setBallToCenter();
// отриросываю стартовое состояние
drawField();

setInterval( tick, TICK_MS );

btnStart.addEventListener('click', startBall);

document.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftLeft') leftRacketSpeed = -RACKET_SPEED;
    if (e.code === 'ControlLeft') leftRacketSpeed = RACKET_SPEED;

    if (e.code === 'ArrowUp') rightRacketSpeed = -RACKET_SPEED;
    if (e.code === 'ArrowDown') rightRacketSpeed = RACKET_SPEED;
});

document.addEventListener('keyup', (e) => {
    if(e.code === 'ShiftLeft' || e.code === 'ControlLeft') leftRacketSpeed = 0;
    if(e.code === 'ArrowUp' || e.code === 'ArrowDown') rightRacketSpeed = 0;
});

// запуск по пробелу
document.addEventListener('keydown', (e) => {
    if ( e.code === 'Space') {

        // чтобы не скроллилась страница
        e.preventDefault();

        // если игра не идёт - стартуем
        if ( !gameRunning ) {
            startBall();
        }
    }
});
