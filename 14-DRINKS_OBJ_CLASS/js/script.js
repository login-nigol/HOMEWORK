//
class ObjStorageClass {
  constructor() {
    // публичный объект для хранения данных (по условию задания)
    this.storage = {};
  }

  addValue = function (key, value) {
    this.storage[key] = value;
  };

  getValue = function (key) {
    return this.storage[key];
  };

  deleteValue = function (key) {
    // .hasOwnProperty - проверяет ключь только этого объекта(не прототипов)
    // в простых ситуациях лучше - ( key in this.storage )
    if (this.storage.hasOwnProperty(key)) {
      delete this.storage[key];
      return true;
    }
    return false;
  };

  getKeys() {
    // Object - возвращает масив всех ключей
    return Object.keys(this.storage);
  }
}

const drinkStorage = new ObjStorageClass();

// обработчик
const addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", function () {
  const drinkName = prompt("Введите название напитка:");
  if (drinkName === null) return;
  if (!drinkName.trim()) {
    alert("Название не может быть пустым");
    return;
  }

  const isAlcoholic = confirm(
    "Это алкогольный напиток? (OK — да, Отмена — нет)"
  );
  const recipe = prompt("Введите рецепт приготовления:");
  if (recipe === null) return;
  if (!recipe.trim()) {
    alert("Рецепт не может быть пустым");
    return;
  }

  drinkStorage.addValue(drinkName.trim(), {
    alco: isAlcoholic,
    recipe: recipe.trim(),
  });

  alert(`Напиток "${drinkName}" добавлен!`);
});

const getBtn = document.getElementById("getBtn");
const drinkInfo = document.getElementById("drinkInfo");
const infoName = document.getElementById("infoName");
const infoAlco = document.getElementById("infoAlco");
const infoRecipe = document.getElementById("infoRecipe");

getBtn.addEventListener("click", function () {
  const drinkName = prompt("Введите название напитка:");
  if (drinkName === null) return;

  const drink = drinkStorage.getValue(drinkName.trim());

  if (drink) {
    infoName.textContent = drinkName;
    infoAlco.textContent = drink.alco ? "да" : "нет";
    infoRecipe.textContent = drink.recipe;
    drinkInfo.style.display = "block";
  } else {
    alert("Напиток не найден");
    drinkInfo.style.display = "none";
  }
});

const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", function () {
  const drinkName = prompt("Введите название напитка для удаления:");
  if (drinkName === null) return;

  const deleted = drinkStorage.deleteValue(drinkName.trim());

  if (deleted) {
    alert(`Напиток "${drinkName}" удалён`);
  } else {
    alert(`Напиток "${drinkName}" не найден`);
  }
});

const allBtn = document.getElementById("allBtn");
const allDrinksList = document.getElementById("allDrinksList");
const drinksList = document.getElementById("drinksList");

allBtn.addEventListener("click", function () {
  const allDrinks = drinkStorage.getKeys();

  // Очищаем список
  drinksList.innerHTML = "";

  if (allDrinks.length === 0) {
    drinksList.innerHTML = "<li>В хранилище нет напитков</li>";
    allDrinksList.style.display = "block";
  } else {
    // Добавляем каждый напиток как элемент списка
    allDrinks.forEach(function (drinkName) {
      const li = document.createElement("li");
      li.textContent = drinkName;
      drinksList.appendChild(li);
    });
    allDrinksList.style.display = "block";
  }
});
