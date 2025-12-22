//
import { formDef1, formDef2 } from "./data.js";
import { createFormRow } from "./builder.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  form.style.display = "none"; // скрываем форму при загрузке

  // функция очистки формы
  function clearForm() {
    form.innerHTML = "";
  }

  // функция построения формы 1
  function buildForm1() {
    formDef1.forEach((fieldDef) => {
      const row = createFormRow(fieldDef);
      form.appendChild(row);
    });
  }

  // функция построения формы 2
  function buildForm2() {
    formDef2.forEach((fieldDef) => {
      const row = createFormRow(fieldDef);
      form.appendChild(row);
    });
  }

  // обработчик кнопки "Создать форму 1"
  document.getElementById("createForm1").addEventListener("click", () => {
    clearForm(); // очищаем форму
    buildForm1(); // строим форму 1
    form.style.display = "block"; // показываем форму
  });

  // обработчик кнопки "Создать форму 2"
  document.getElementById("createForm2").addEventListener("click", () => {
    clearForm(); 
    buildForm2(); 
    form.style.display = "block"; 
  });

  // закрытие модалкии
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").close();
  });
});
