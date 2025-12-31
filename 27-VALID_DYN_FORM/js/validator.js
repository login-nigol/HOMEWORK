// validator

// показать ошибку у поля (ищем .form-error в ближайшем .input-wrap)
function showError(field, message) {
  const wrap = field.closest(".input-wrap"); // общий контейнер поля
  const error = wrap.querySelector(".form-error"); // иконка ошибки

  error.textContent = "!";
  error.dataset.error = message;
  error.style.display = "block";
}

// скрыть ошибку
function hideError(field) {
  const wrap = field.closest(".input-wrap");
  const error = wrap.querySelector(".form-error");

  error.style.display = "none";
  error.dataset.error = "";
}

// проверка поля на пустоту. вынес для переиспользования
function validateRequired(field) {
  if (field.value.trim() === "") {
    showError(field, "Поле обязательно!");
    return false;
  }
  return true;
}

// проверка текстового поля
function validateTextField(field) {
  const value = field.value.trim(); // убираем пробелы

  if (!validateRequired(field)) return false;

  if (value.length < 2) {
    // мало символов
    showError(field, "Минимум 2 символа!");
    return false;
  }

  //  цикл проверки символов(учебный костыль) - альтернатива без RegExp
  // RegExp - ((!/^[a-zа-яё0-9\s-]+$/i.test(value)))
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);

    // буквы латиницы и кириллицы + пробел
    const isLetter =
      (code >= 65 && code <= 90) || // A-Z
      (code >= 97 && code <= 122) || // a-z
      (code >= 1040 && code <= 1103) || // А-я
      code === 32; // пробел

    if (!isLetter) {
      showError(field, "Недопустимые символы, только буквы и пробелы!");
      return false;
    }
  }

  hideError(field); // всё ок
  return true;
}

// проверка URL
function validateUrlField(field) {
  const value = field.value.trim();

  if (!validateRequired(field)) return false;

  // нативная проверка браузера
  try {
    new URL(field.value.trim());
  } catch {
    showError(field, "Некорректный URL!");
    return false;
  }

  hideError(field);
  return true;
}

// проверка даты запуска
function validateDateField(field) {
  if (!validateRequired(field)) return false;

  hideError(field);
  return true;
}

// проверка visitors (число)
function validateVisitorsField(field) {
  if (!validateRequired(field)) return false;

  const num = Number(field.value);

  if (!Number.isInteger(num) || num < 0) {
    showError(field, "Введите целое число ≥ 0");
    return false;
  }

  hideError(field);
  return true;
}

// проверка email
function validateEmailField(field) {
  if (!validateRequired(field)) return false; // не пусто

  // нативная проверка браузера
  if (!field.checkValidity()) {
    showError(field, "Введите корректный e-mail!");
    return false;
  }

  hideError(field);
  return true;
}

// проверка select (рубрика)
function validateSelectField(field) {
  if (field.value === "") {
    showError(field, "Выберите рубрику!");
    return false;
  }

  hideError(field);
  return true;
}

// проверка radio-группы
function validateRadioField(form, name) {
  const value = form.elements[name].value; // '' если не выбрано

  if (value === "") {
    showError(form.elements[name][0], "Выберите вариант!"); // ошибка у первого радио
    return false;
  }

  hideError(form.elements[name][0]);
  return true;
}

// проверка checkbox
function validateCheckboxField(field) {
  if (!field.checked) {
    showError(field, "Необходимо разрешить отзывы!");
    return false;
  }

  hideError(field);
  return true;
}

// rules: описание обязательно; минимум 10 символов (чтобы не "ок")
function validateDescriptionField(field) {
  const value = field.value.trim();

  if (!validateRequired(field)) return false;

  if (value.length < 10) {
    showError(field, "Минимум 10 символов!");
    return false;
  }

  hideError(field);
  return true;
}

// submit: проверяем все поля
function validateFormSubmit(eo, form) {
  eo = eo || window.event;

  try {
    const devField = form.elements.developers; // поле разработчики
    const siteField = form.elements.siteName; // поле сайт
    const urlField = form.elements.siteUrl; // поле урл страницы
    const dateField = form.elements.launchDate; // поле даты
    const visitorsField = form.elements.visitors; // поле поситителей
    const emailField = form.elements.email; // поле мыла
    const catalogField = form.elements.catalog; // поле рубрики(меню)
    const placementField = form.elements.placement; // поле для радио
    const reviewsField = form.elements.reviews; // поле для птички
    const descriptionField = form.elements.description; // поле описание

    let firstErrorField = null; // для фокуса

    if (!validateTextField(devField)) firstErrorField = devField;

    // если siteField не прошёл проверку и ещё не найдено поле с ошибкой
    // сохраняем siteField как первое ошибочное поле
    if (!validateTextField(siteField) && !firstErrorField)
      firstErrorField = siteField;

    if (!validateUrlField(urlField) && !firstErrorField)
      firstErrorField = urlField;

    if (!validateDateField(dateField) && !firstErrorField)
      firstErrorField = dateField;

    if (!validateVisitorsField(visitorsField) && !firstErrorField)
      firstErrorField = visitorsField;

    if (!validateEmailField(emailField) && !firstErrorField)
      firstErrorField = emailField;

    if (!validateSelectField(catalogField) && !firstErrorField)
      firstErrorField = catalogField;

    if (!validateRadioField(form, "placement") && !firstErrorField)
      firstErrorField = placementField[0];

    if (!validateCheckboxField(reviewsField) && !firstErrorField)
      firstErrorField = reviewsField;

    if (!validateDescriptionField(descriptionField) && !firstErrorField)
      firstErrorField = descriptionField;

    if (firstErrorField) {
      eo.preventDefault(); // отмена отправки
      firstErrorField.scrollIntoView({ block: "center" });
      firstErrorField.focus();
    }
  } catch (err) {
    console.error("Ошибка submit-валидации:", err);
    eo.preventDefault();
  }
}

// blur: проверяем только текущее поле
function validateFormBlur(eo) {
  eo = eo || window.event;

  const field = eo.target;

  if (field.tagName !== "INPUT" && field.tagName !== "TEXTAREA") return; // не наше поле

  if (field.name === "siteUrl") {
    validateUrlField(field);
    return;
  }

  if (field.name === "launchDate") {
    validateDateField(field);
    return;
  }

  if (field.name === "visitors") {
    validateVisitorsField(field);
    return;
  }

  if (field.type === "text") {
    validateTextField(field);
    return;
  }

  if (field.name === "email") {
    validateEmailField(field);
    return;
  }

  if (field.name === "description") {
    validateDescriptionField(field);
    return;
  }

  try {
    validateTextField(field);
  } catch (err) {
    console.error("Ошибка blur-валидации", err);
  }
}
