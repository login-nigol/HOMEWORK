'use strict';

// constants
const TICK_MS = 40;
const RACKET_SPEED = 5;
const BALL_SPEED = 5;

// DOM
const field = document.getElementById('field');
const ball = document.getElementById('ball');
const btnStart = document.querySelector('.btn-start');
const scoreLeftEl = document.querySelector('.score--left');
const scoreRightEl = document.querySelector('.score--right');

const racketLeft = document.getElementById('racketLeft');
const racketRight = document.getElementById('racketRight'); 

// счёт
let scoreLeft = 0;
let scoreRight = 0;
let gameRunning = false; // мяч летит или ждёт старт

// состояние ракеток
let racketLeftY = 110;
let racketRightY = 110;
let racketLeftSpeed = 0;
let racketRightSpeed = 0;

// модель мяча
const ballH = {
    posX: 0,
    posY: 0,
    speedX: 0,
    speedY: 0,
    width: 0,
    height: 0,

    // обновление DOM-позиции
    update() {
        ball.style.left = this.posX + 'px';
        ball.style.top = this.posY + 'px';
    },
};

function renderScore() {
    scoreLeftEl.textContent = scoreLeft;
    scoreRightEl.textContent = scoreRight;
}

// получаю реальные размеры мяча из DOM
function initBallSize() {
    ballH.width = ball.offsetWidth;
    ballH.height = ball.offsetHeight;
}

// ставлю мяч в центре поля
function setBallToCenter() {
    ballH.posX = ( field.clientWidth - ballH.width ) / 2;
    ballH.posY = ( field.clientHeight - ballH.height ) / 2;
    ballH.update();
}

function stopBallAtLeftWall() {
    ballH.speedX = 0;
    ballH.speedY = 0;
    ballH.posX = 0; // прилип к левой стенке
    ballH.update();
    gameRunning = false;
}

function stopBallAtRightWall() {
    ballH.speedX = 0;
    ballH.speedY = 0;
    ballH.posX = field.clientWidth - ballH.width; // прилип к правой стенке
    ballH.update();
    gameRunning = false;
}

// гол в левые ворота => очко правому
function registerGoalToLeft() {
    scoreRight += 1;
    renderScore();
    stopBallAtLeftWall();
}

// гол в правые ворота => очко левому
function registerGoalToRight() {
    scoreLeft += 1;
    renderScore();
    stopBallAtRightWall();
}

// запуск мяча
function startBall() {
    setBallToCenter();
    
    // const speed = 5;
    const angle = Math.random() * Math.PI / 3 - Math.PI / 6; // -30° .. +30°
    
    ballH.speedX = BALL_SPEED * Math.cos(angle);
    ballH.speedY = BALL_SPEED * Math.sin(angle);
    
    // случайно влево или вправо
    if (Math.random() < 0.5) {
        ballH.speedX = -ballH.speedX;
    }
    
    gameRunning = true;
}

// один шаг анимации. равномерное движение + отскок
function tick() {
    // движение ракеток всегда, даже если мяч стоит
    racketLeftY += racketLeftSpeed;
    racketRightY += racketRightSpeed;
    
    racketLeftY = Math.max(0, Math.min(
        field.clientHeight - racketLeft.offsetHeight, racketLeftY));
    racketRightY = Math.max(0, Math.min(
        field.clientHeight - racketRight.offsetHeight, racketRightY));
    
    // обновление DOM ракеток
    racketLeft.style.top = racketLeftY + 'px';
    racketRight.style.top = racketRightY + 'px';

    // если игра не запущена - мяч стоит прилипшим
    if ( !gameRunning ) return;

    // движение мяча
    ballH.posX += ballH.speedX;
    ballH.posY += ballH.speedY;
    
    // отскок от верхней стенки
    if ( ballH.posY < 0 ) {
        ballH.speedY = -ballH.speedY;
        ballH.posY = 0;
    }    
    // отскок от нижней стенки
    if ( ballH.posY + ballH.height > field.clientHeight ) {
        ballH.speedY = -ballH.speedY;
        ballH.posY = field.clientHeight - ballH.height;
    }

    // отскок от левой ракетки
    if (
    ballH.speedX < 0 &&
    ballH.posX <= racketLeft.offsetWidth &&
    ballH.posY + ballH.height >= racketLeftY &&
    ballH.posY <= racketLeftY + racketLeft.offsetHeight
    ) {
        ballH.speedX = -ballH.speedX;
        ballH.posX = racketLeft.offsetWidth;
    }

    // отскок от правой ракетки
    if (
        ballH.speedX > 0 &&
        ballH.posX + ballH.width >= field.clientWidth - racketRight.offsetWidth &&
        ballH.posY + ballH.height >= racketRightY &&
        ballH.posY <= racketRightY + racketRight.offsetHeight
    ) {
        ballH.speedX = -ballH.speedX;
        ballH.posX = 
            field.clientWidth - racketRight.offsetWidth - ballH.width;
    }

    // голы: мяч не пролетает стенку, упирается и останавливается
    if ( ballH.posX <= 0 ) {
        ballH.posX = 0;
        ballH.update();
        registerGoalToLeft();
        return;
    }

    if ( ballH.posX + ballH.width >= field.clientWidth ) {
        ballH.posX = field.clientWidth - ballH.width;
        ballH.update();
        registerGoalToRight();
        return;
    }
    
    // обновление DOM мяча
    ballH.update();    
}

// инициализация
initBallSize();
setBallToCenter();
renderScore();

// один таймер
setInterval( tick, TICK_MS);

btnStart.addEventListener('click', startBall);

// движение ракеток по событию кейдоун
document.addEventListener('keydown', elem => {
    if(elem.code === 'ShiftLeft') racketLeftSpeed = -RACKET_SPEED;
    if(elem.code === 'ControlLeft') racketLeftSpeed = RACKET_SPEED;
    if(elem.code === 'ArrowUp') racketRightSpeed = -RACKET_SPEED;
    if(elem.code === 'ArrowDown') racketRightSpeed = RACKET_SPEED;
});

document.addEventListener('keyup', elem => {
    if(['ShiftLeft','ControlLeft'].includes(elem.code)) racketLeftSpeed = 0;
    if(['ArrowUp','ArrowDown'].includes(elem.code)) racketRightSpeed = 0;
});
