/**
 * TREE SUM - рекурсивная функция для суммирования чисел в многоуровневом массиве
 * @param {Array} arr - Входной массив (может содержать вложенные массивы)
 * @returns {number} - Сумма всех числовых элементов
 */
function treeSum(arr) {
  let sum = 0;

  for (let s = 0; s < arr.length; s++) {
    const item = arr[s];

    if (Array.isArray(item)) {
      sum += treeSum(item);
    } else if (typeof item === "number") {
      sum += item;
    }
    // остальные типы (строки, null, undefined и т.д.) игнорируем
  }

  return sum;
}

// ===== ТЕСТИРОВАНИЕ =====
const testArrays = {
  "Сложный массив с разными типами": [
    10,
    [5, "text", 15],
    [
      [3, "a", 7],
      [1, ["X", 2, "Y"]],
    ],
    3.14,
    -5,
    [100],
  ],
};

// ===== ЭКСПОРТ ДЛЯ БРАУЗЕРА =====
if (typeof window !== "undefined") {
  window.treeSum = treeSum;
  window.testArrays = testArrays;
}

// ===== ЭКСПОРТ ДЛЯ NODE.JS =====
if (typeof module !== "undefined" && module.exports) {
  module.exports = { treeSum, testArrays };
}

// ===== КОНСОЛЬНОЕ ТЕСТИРОВАНИЕ =====
console.log(
  "%c🌳 TREE SUM - Рекурсивная сумма массива",
  "color: #6a11cb; font-size: 18px; font-weight: bold;"
);
console.log("=".repeat(60));

Object.entries(testArrays).forEach(([name, array]) => {
  const result = treeSum(array);
  const expected = 141.14;

  const passed = Math.abs(result - expected) < 0.0001; // Учитываем погрешность для дробных чисел

  console.log(`%c${name}:`, "font-weight: bold;");
  console.log(`  Массив: ${JSON.stringify(array)}`);
  console.log(`  Результат: ${result}`);
  console.log(`  Ожидалось: ${expected}`);
  console.log(`  Статус: ${passed ? "✅ УСПЕХ" : "❌ ОШИБКА"}`);
  console.log("=".repeat(60));
});

// ===== ФУНКЦИЯ ДЛЯ ОТОБРАЖЕНИЯ РЕЗУЛЬТАТОВ В DOM =====
function displayResults() {
  const resultsContainer = document.getElementById("results");
  if (!resultsContainer) {
    console.error("❌ Контейнер для результатов не найден!");
    return;
  }

  // Очищаем контейнер
  resultsContainer.innerHTML = "";

  // Для каждого тестового массива создаём блок с результатами
  Object.entries(testArrays).forEach(([name, array]) => {
    const result = treeSum(array);
    const expected = 141.14;

    const passed = Math.abs(result - expected) < 0.0001; // Учитываем погрешность для дробных чисел

    const resultDiv = document.createElement("div");
    resultDiv.className = "result-item";
    resultDiv.innerHTML = `
            <h4>${name}</h4>
            <div class="array-preview">${JSON.stringify(array, null, 2)}</div>
            <div class="result-value">Результат: <strong>${result}</strong></div>
            <div class="expected">Ожидалось: ${expected}</div>
            <div class="status ${passed ? "success" : "error"}">
                ${passed ? "✅ Тест пройден" : "❌ Тест не пройден"}
            </div>
        `;

    resultsContainer.appendChild(resultDiv);
  });
}

// ===== ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM загружен, запускаем отображение результатов...");

  // Делаем функцию доступной глобально
  window.treeSum = treeSum;

  // Отображаем результаты тестирования
  displayResults();

  console.log("✅ Приложение успешно инициализировано!");
});
