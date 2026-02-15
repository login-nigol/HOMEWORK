// js/script.js
'use strict';

// === константы(ключи) ===

const LS_KEY_DRINKS = "DRINKS";
const LS_KEY_FOODS = "FOODS";

// === создание хранилищ ===

const drinkStorage = new LocStorageClass(LS_KEY_DRINKS);
const foodStorage = new LocStorageClass(LS_KEY_FOODS);

// вызываю базу
seedDefaults(drinkStorage, foodStorage);

// === селекторы ===

const drinkAddBtn = document.getElementById('drinkAddBtn');
const drinkGetBtn = document.getElementById('drinkGetBtn');
const drinkDeleteBtn = document.getElementById('drinkDeleteBtn');
const drinkAllBtn = document.getElementById('drinkAllBtn');

const foodAddBtn = document.getElementById('foodAddBtn');
const foodGetBtn = document.getElementById('foodGetBtn');
const foodDeleteBtn = document.getElementById('foodDeleteBtn');
const foodAllBtn = document.getElementById('foodAllBtn');

// === функции(универсальные) ===

function promptName(entityTitle) {
    const name = prompt(`Введите название (${entityTitle}):`);
    if ( name === null ) return null; // отмена

    const trimmed = name.trim();
    if ( !trimmed ) {
        alert("Название не может быть пустым");
        return null;
    }
    return trimmed;
}

function promptRecipe(entityTitle) {
    const recipe = prompt(`Введите рецепт (${entityTitle}):`);
    if ( recipe === null ) return null;

    const trimmed = recipe.trim();
    if ( !trimmed ) {
        alert("Рецепт не может быть пустым");
        return null;
    }
    return trimmed;
}

// === напитки: дополнительное поле "alco" ===

function addDrink() {
    const name = promptName("напиток");
    if ( !name ) return;

    const isAlcoholic = confirm("Алкогольный? ОК - да, Отмена - нет");
    const recipe = promptRecipe("напиток");
    if ( !recipe ) return;

    drinkStorage.addValue(name, { alco: isAlcoholic, recipe });
    alert(`Напиток "${name}" сохранён`);
}

function getDrink() {
    const name = promptName("напиток");
    if ( !name ) return;

    const data = drinkStorage.getValue(name);
    if ( !data ) {
        alert(`Напиток "${name}" не найден`);
        return;
    }

    alert(
        `напиток ${name}\n` +
        `алкогольный: ${data.alco ? "да" : "нет"}\n` +
        `рецепт:\n${data.recipe}`
    );
}

function deleteDrink() {
    const name = promptName("напиток");
    if ( !name ) return;

    const ok = drinkStorage.deleteValue(name);
    alert(ok ? `Напиток "${name}" удалён` : `Напиток "${name}" не найден`);
}

function listDrinks() {
    const keys = drinkStorage.getKeys();
    alert(keys.length ? keys.join("\n") : "В баре нет напитков");
}

// === блюда ===

function addFood() {
    const name = promptName("блюдо");
    if ( !name ) return;

    const recipe = promptRecipe("блюдо");
    if ( !recipe ) return;

    foodStorage.addValue(name, { recipe });
    alert(`Блюдо "${name}" сохранено`);
}

function getFood() {
    const name = promptName("блюдо");
    if ( !name ) return;

    const data = foodStorage.getValue(name);
    if ( !data ) {
        alert(`Блюдо "${name}" не найдено`);
        return;
    }
    alert(`блюдо ${name}\nрецепт:\n${data.recipe}`);
}

function deleteFood() {
    const name = promptName("блюдо");
    if ( !name ) return;

    const ok = foodStorage.deleteValue(name);
    alert(ok ? `Блюдо "${name}" удалено` : `Блюдо "${name}" не найдено`);
}

function listFoods() {
    const keys = foodStorage.getKeys();
    alert(keys.length ? keys.join("\n") : "На кухне нет блюд");
}

// === оюработчики ===

drinkAddBtn.addEventListener("click", addDrink);
drinkGetBtn.addEventListener("click", getDrink);
drinkDeleteBtn.addEventListener("click", deleteDrink);
drinkAllBtn.addEventListener("click", listDrinks);

foodAddBtn.addEventListener("click", addFood);
foodGetBtn.addEventListener("click", getFood);
foodDeleteBtn.addEventListener("click", deleteFood);
foodAllBtn.addEventListener("click", listFoods);