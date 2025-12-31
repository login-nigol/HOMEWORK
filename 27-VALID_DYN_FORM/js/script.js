// function
const form = document.getElementById("catalogForm");
buildForm(form);

// change: валидируем select сразу при изменении
form.addEventListener("change", (eo) => {
  const field = eo.target;

  if (field.tagName === "SELECT" && field.name === "catalog") {
    validateSelectField(field);
  }
});

// проверка radio по CHANGE
form.addEventListener("change", (eo) => {
  const field = eo.target;

  if (field.type === "radio" && field.name === "placement") {
    validateRadioField(form, "placement");
  }
});

// проверка radio по CHANGE
form.addEventListener("change", (eo) => {
  const field = eo.target;

  if (field.type === "checkbox" && field.name === "reviews") {
    validateCheckboxField(field);
  }
});

form.addEventListener("submit", (eo) => validateFormSubmit(eo, form), false);
form.addEventListener("blur", validateFormBlur, true);
