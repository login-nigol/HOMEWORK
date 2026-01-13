'use strict'; // строгий режим

// [...str] - преобразует строку в массив символов
const vowelsStr = 'aeiouyаеёиоуыэюяAEIOUYАЕЁИОУЫЭЮЯ';
const vowelsArr = [...vowelsStr];

const textInput = document.getElementById('textInput');
const resultElement = document.getElementById('result');

// ===== forEach =====
function countVowelsForEach(str) {
    // строку превращаем в массив ВНУТРИ функции
    const letters = [...str];

    let count = 0;

    letters.forEach(char => {
        // если символ есть в списке гласных — увеличиваем счётчик
        if ( vowelsArr.includes(char) ) {
            count++;
        }
    });

    return count;
}

// ===== filter =====
function countVowelsFilter(str) {
    const letters = [...str];

    return letters
    // filter(...) — оставляет только гласные
    .filter( char => vowelsArr.includes(char) )
    .length; // их количество
}

// ===== reduce =====
// reduce проходит по массиву и накапливает результат
// если символ — гласная → увеличиваем счётчик
// 0 — начальное значение счётчика
function countVowelsReduce(str) {
    const letters = [...str];

    return letters.reduce( (sum, char) => {
        return vowelsArr.includes(char) ? sum + 1 : sum;
    }, 0);
}


textInput.addEventListener('keydown', (event) => {
    if ( event.key !== 'Enter') return; // реагируем только на энтер

    const userText = textInput.value; // берём текст из input, строка от пользователя

    const resultForEach = countVowelsForEach(userText);
    const resultFilter = countVowelsFilter(userText);
    const resultReduce = countVowelsReduce(userText);

    resultElement.innerHTML = 
    `1. Результат функции forEach<br>Гласных букв: ${resultForEach}<hr><br>` +
    `2. Результат функции filter<br>Гласных букв: ${resultFilter}<hr><br>` +
    `3. Результат функции reduce<br>Гласных букв: ${resultReduce}<hr>`;


    console.log("Результат функции forEach\nГласных букв: " + resultForEach);
    console.log("Результат функции filter\nГласных букв: " + resultFilter);
    console.log("Результат функции reduce\nГласных букв: " + resultReduce);
});
