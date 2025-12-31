// функция-конструктор для хранилища
function ObjStorageFunk() {
  const self = this; // фиксирую контекст
  const storage = {}; // приватный объект для данных

  self.addValue = function (key, value) {
    storage[key] = value;
  }; 

  self.getValue = function (key) {
    return storage[key];
  };

  self.deleteValue = function (key) {
    if (key in storage) {
      delete storage[key];
      return true;
    }
    return false;
  };

  self.getKeys = function () {
    return Object.keys(storage);
  };
}

const drinkStorage = new ObjStorageFunk();

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

// const testStorage = new ObjStorageFunk();
// testStorage.addValue("чай", { alco: false, recipe: "залить кипятком" });
// console.log(testStorage.getValue("чай"));
// testStorage.addValue("кофе", { alco: false, recipe: "всарить в турке" });
// console.log(testStorage.getValue("кофе"));
// console.log(testStorage.getKeys());
// testStorage.deleteValue("чай");
// console.log(testStorage.getKeys());
