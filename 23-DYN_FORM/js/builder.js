// builder.js — создаёт элемент формы (поле или кнопку)
// объект-маппинг: kind -> функция создания элемента
const fieldCreators = {
  longtext: () => createInput("text"),
  shorttext: () => createInput("text"),
  number: () => createInput("number"),
  dropdown: () => document.createElement("select"),
  radio: () => createRadioGroup(),
  check: () => createInput("checkbox"),
  memo: () => document.createElement("textarea"),
  submit: () => null, // обработаем отдельно
};

// вспомогательная функция создания input
function createInput(type) {
  const input = document.createElement("input");
  input.type = type;
  return input;
}

// функция создания группы радио-кнопок
function createRadioGroup() {
  const container = document.createElement("div");
  container.className = "radio-group";
  return container;
}

// основная функция
function createFormRow(fieldDef) {
  const row = document.createElement("div");
  row.className = "form-row";

  // если это кнопка
  if (fieldDef.kind === "submit") {
    // создаём элемент <input type="submit">
    const submitButton = document.createElement("input");
    // тип "кнопка отправки формы"
    submitButton.type = "submit";
    // текст на кнопке
    submitButton.value = fieldDef.caption;
    // вешаем обработчик клика, открываем модалку вместо отправки
    // event - параметр обработчика
    // submitButton.addEventListener("click", (e) => {
    // отменяем стандартную отправку формы
    //   e.preventDefault();
    // открываем модальное окно
    //   document.getElementById("modal").showModal();
    // });

    // добавляем кнопку в строку
    row.appendChild(submitButton);
    return row;
  }

  // создаём тег - <label>
  const lable = document.createElement("label");
  // устанавливаем текст лейбла, берём из объекта поля
  lable.textContent = fieldDef.label;
  // связываем лейбл с полем ввода по id, атрибут "for" равен id инпута
  lable.htmlFor = fieldDef.name;

  if (fieldDef.kind !== "check") {
    row.appendChild(lable);
  }

  // получаем функцию-создатель
  const creator = fieldCreators[fieldDef.kind];

  if (!creator) {
    throw new Error(`Поле с типом + ${fieldDef.kind} + не найдено!`);
  }

  const fieldElement = creator();

  // проверяем, есть ли у поля свойство name (все поля, кроме submit, имеют name)
  if (fieldDef.name) {
    // устанавливаем атрибут name — для отправки данных на сервер
    fieldElement.name = fieldDef.name;
    // устанавливаем id — для связи с label (htmlFor) и стилизации
    fieldElement.id = fieldDef.name;

    // Установка значения по умолчанию для input
    if (fieldDef.placeholder) {
      fieldElement.placeholder = fieldDef.placeholder;
    }
  }

  // dropdown — добавляем варианты
  if (fieldDef.kind === "dropdown" && fieldDef.variants) {
    fieldDef.variants.forEach((variant) => {
      const option = document.createElement("option");
      option.value = variant.value;
      option.textContent = variant.text;
      fieldElement.appendChild(option);
    });
  }

  // radio — создаём группу радиокнопок
  if (fieldDef.kind === "radio" && fieldDef.variants) {
    // fieldElement уже контейнер .radio-group
    fieldDef.variants.forEach((variant, index) => {
      const radioWrapper = document.createElement("div");
      radioWrapper.className = "radio-option";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = fieldDef.name;
      radio.value = variant.value;
      // уникальный id для связки radio-lab,
      // payment(бесплатное)_1, payment(платное)_2 — уникальные id для каждой радиокнопки
      radio.id = `${fieldDef.name}_${variant.value}`;

      if (index === 0) {
        radio.checked = true;
      }

      const radioLabel = document.createElement("label");
      radioLabel.htmlFor = radio.id;
      radioLabel.textContent = variant.text;

      radioWrapper.appendChild(radio);
      radioWrapper.appendChild(radioLabel);
      fieldElement.appendChild(radioWrapper);
    });
  }

  // check — одиночный чекбокс (например "Разрешить отзывы")
  if (fieldDef.kind === "check") {
    // fieldElement уже создан как <input type="checkbox">
    // Добавляем label для чекбокса (текст справа)
    const checkLabel = document.createElement("label");
    checkLabel.htmlFor = fieldDef.name;
    checkLabel.textContent = fieldDef.label; // например "разрешить отзывы"

    fieldElement.checked = true; // чекбокс отмечен

    // убираем основной label (он уже есть в row)
    // row.removeChild(label);

    // вставляем чекбокс и его label
    row.appendChild(checkLabel);
    row.appendChild(fieldElement);
    return row; // возвращаем, чтобы не добавлять fieldElement ещё раз
  }

  // memo — многострочное поле
  if (fieldDef.kind === "memo") {
    // fieldElement уже создан как <textarea>
    // добовляем атрибуты rows, cols
    fieldElement.rows = 4;
    fieldElement.cols = 40;
    // Дальше поле добавится в row автоматически
  }

  // добовляем элемент
  row.appendChild(fieldElement);
  return row;
}

export { createFormRow };
