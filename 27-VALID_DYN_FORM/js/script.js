// function
// main: форма генерится по кнопке, а не сразу
const form = document.getElementById("catalogForm");
const createBtn = document.getElementById("createForm");

// прячем пустую форму при старте
form.classList.add("is-hidden");

createBtn.addEventListener("click", () => {
  // если уже создавали — чистим, чтобы не дублировалась разметка
  form.innerHTML = "";

  buildForm(form); // генерация формы (creator.js)
  form.classList.remove("is-hidden"); // показываем форму
});

// change: валидируем поля сразу при изменении
form.addEventListener("change", (eo) => {
  const field = eo.target;

  // SELECT (каталог)
  if (field.tagName === "SELECT" && field.name === "catalog") {
    validateSelectField(field);
  }

  // RADIO-группа (placement)
  if (field.type === "radio" && field.name === "placement") {
    validateRadioField(form, "placement"); // важно: функция ждёт form + name группы
  }

  // CHECKBOX (reviews)
  if (field.type === "checkbox" && field.name === "reviews") {
    validateCheckboxField(field);
  }
});


form.addEventListener("submit", (eo) => validateFormSubmit(eo, form), false);
form.addEventListener("blur", validateFormBlur, true);
