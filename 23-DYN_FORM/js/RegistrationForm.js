// функция создаёт форму

function createFormRow(fieldDef) {
  const row = document.createElement("div");
  row.className = "form-row";

  if (fieldDef.kind === "submit") {
    // кнопка submit
    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = fieldDef.caption;

    submitButton.addEventListener("click", (event) => {
      event.preventDefault(); // отменяем отправку формы
      const modal = document.getElementById("modal");
      modal.showModal();
    });

    row.appendChild(submitButton);
  } else {
    // поле с label и input
    const label = document.createElement("label");
    label.textContent = fieldDef.label;
    label.htmlFor = fieldDef.name;

    // устанавливаем "kind:" тип
    const input = document.createElement("input");
    input.type = fieldDef.kind === "number" ? "number" : "text";
    input.name = fieldDef.name;
    input.id = fieldDef.name;

    row.appendChild(label);
    row.appendChild(input);
  }

  return row;
}

const formDef2 = [
  { label: "Фамилия:", kind: "longtext", name: "lastname" },
  { label: "Имя:", kind: "longtext", name: "firstname" },
  { label: "Отчество:", kind: "longtext", name: "secondname" },
  { label: "Возраст:", kind: "number", name: "age" },
  { caption: "Зарегистрироваться", kind: "submit" },
];

// экспортируем функцию
// export { createFormRow, formDef2 };
