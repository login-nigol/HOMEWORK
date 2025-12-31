// test.js
import { createFormRow } from "./builder.js";

function runTests() {
  console.log("=== ТЕСТЫ createFormRow ===");

  // тест 1: текстовое поле
  {
    console.log("Тест 1 создание текстового поля: longtext");
    const field = createFormRow({
      label: "Тест",
      kind: "longtext",
      name: "test",
    });
    const input = field.querySelector('input[type="text"]');
    console.assert(input && input.name === "test", "❌ longtext НЕ СОЗДАН!!!");
    console.log("✅ пройден");
  }

  // тест 2: числовое поле
  {
    console.log("Тест 2 создание числового поля: number");
    const field = createFormRow({
      label: "Число",
      kind: "number",
      name: "num",
    });
    const input = field.querySelector('input[type="number"]');
    console.assert(input && input.name === "num", "❌ number НЕ СОЗДАН!!!");
    console.log("✅ пройден");
  }

  // тест 3: dropdown
  {
    console.log("Тест 3 создание выподающего списка: dropdown");
    const field = createFormRow({
      label: "Выбор",
      kind: "dropdown",
      name: "sel",
      variants: [{ text: "Вариант", value: 1 }],
    });
    const select = field.querySelector("select");
    console.assert(
      select && select.options.length === 1,
      "❌ dropdown НЕ СОЗДАН!!!"
    );
    console.log("✅ пройден");
  }

  // тест 4: radio
  {
    console.log("Тест 4 создание радиокнопки: radio");
    const field = createFormRow({
      label: "Радио",
      kind: "radio",
      name: "rad",
      variants: [
        { text: "Да", value: 1 },
        { text: "Нет", value: 2 },
      ],
    });
    const radios = field.querySelectorAll('input[type="radio"]');
    console.assert(radios.length === 2, "❌ radio НЕ СОЗДАН!!!");
    console.assert(radios[0].checked, "❌ первый radio НЕ ОТМЕЧЕН!!!");
    console.log("✅ пройден");
  }

  // тест 5: checkbox
  {
    console.log("Тест 5 создание чекбокс: check");
    const field = createFormRow({
      label: "Галочка",
      kind: "check",
      name: "chk",
    });
    const checkbox = field.querySelector('input[type="checkbox"]');
    console.assert(
      checkbox && checkbox.checked,
      "❌ checkbox НЕ СОЗДАН или НЕ ОТМЕЧЕН!!!"
    );
    console.log("✅ пройден");
  }

  // тест 6: submit
  {
    console.log("Тест 6 создание кнопки: submit");
    const field = createFormRow({ caption: "Отправить", kind: "submit" });
    const button = field.querySelector('input[type="submit"]');
    console.assert(
      button && button.value === "Отправить",
      "❌ submit НЕ СОЗДАНА!!!"
    );
    console.log("✅ пройден");
  }

  // тест 7: неизвестный kind → ошибка
  {
    console.log("Тест 7: неизвестный kind → ошибка");
    let errorCaught = false;
    try {
      createFormRow({ kind: "unknown" });
    } catch (e) {
      errorCaught = true;
    }
    console.assert(errorCaught, "❌ ОЖИДАЛАСЬ ОШИБКА!!!");
    console.log("✅ пройден");
  }

  console.log("=== ВСЕ ТЕСТЫ ПРОЙДЕНЫ ===");
}

// запускаем тесты при загрузке страницы, в URL добавляем ?test
if (location.search.includes("test")) {
  document.addEventListener("DOMContentLoaded", runTests);
}

export { runTests };
