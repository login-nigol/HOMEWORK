'use strict';

import { ShareService } from "./services/ShareService.js";
import { ProgressService } from "./services/ProgressService.js";

// === DOM-селекторы ===
const $preview = document.getElementById('preview');
const $downloadBtn = document.getElementById('downloadBtn');
const $errorMsg = document.getElementById('errorMsg');

// === функции ===

// показываем ошибку
function showError() {
    $errorMsg.hidden = false;
    $downloadBtn.hidden = true;
}

// загружаем картинку по ключу и показываем
async function loadImage(key) {
    try {
        // console.log('before show');
        ProgressService.show('Загрузка картинки...');
        // console.log('after show');

        const dataURL = await ShareService.loadSharedImage(key);

        $preview.src = dataURL;    
        ProgressService.hide();    
    } catch {
        ProgressService.hide();
        showError();
    }
}

// скачиваем картинку
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'pixsora-image.png';
    link.href = $preview.src;
    link.click();
}

// === Инициализация ===

ProgressService.init();

// читаем ключ из URL (?key=...)
const params = new URLSearchParams(window.location.search);
const key = params.get('key');

if ( !key ) {
    showError();
} else {
    loadImage(key);
}

// === Обработчики ===

$downloadBtn.addEventListener('click', downloadImage);