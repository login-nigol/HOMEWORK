function startAnketa() {
  let lastName, firstName, middleName, age, isMale;
  let isValid = false;

  // Фамилия
  do {
    lastName = prompt("Введите фамилию:") ?? "";
    const hasValue = lastName.trim();
    const correctFormat = lastName.match(/^[а-яёa-z\s\-]+$/i);
    isValid = hasValue && correctFormat;

    if (!isValid) {
      alert(!hasValue ? "Поле обязательно!" : "Только буквы и дефисы!");
    }
  } while (!isValid);

  // Имя
  isValid = false;
  do {
    firstName = prompt("Введите имя:") ?? "";
    const hasValue = firstName.trim();
    const correctFormat = firstName.match(/^[а-яёa-z\s\-]+$/i);
    isValid = hasValue && correctFormat;

    if (!isValid) {
      alert(!hasValue ? "Поле обязательно!" : "Только буквы и дефисы!");
    }
  } while (!isValid);

  // Отчество
  isValid = false;
  do {
    middleName = prompt("Введите отчество:") ?? "";
    const hasValue = middleName.trim();
    const correctFormat = middleName.match(/^[а-яёa-z\s\-]+$/i);
    isValid = hasValue && correctFormat;

    if (!isValid) {
      alert(!hasValue ? "Поле обязательно!" : "Только буквы и дефисы!");
    }
  } while (!isValid);

  // Возраст
  do {
    let ageInput = prompt("Введите возраст:") ?? "";

    if (!ageInput.trim()) {
      alert("Обязательное поле!");
      continue;
    }

    if (isNaN(ageInput)) {
      alert("Должно быть числом!");
      continue;
    }

    age = Number(ageInput);

    if (age < 7) {
      alert("От 7 лет!");
      continue;
    }

    if (age > 120) {
      alert("До 120 лет!");
      continue;
    }

    break;
  } while (true);

  // Пол
  isMale = confirm("Ваш пол - мужской?\n(OK - мужской, Отмена - женский)");

  // Расчёты
  let ageInDays = age * 365;
  let ageAfter5Years = age + 5;
  let genderText = isMale ? "мужской" : "женский";
  let pensionAge = isMale ? 63 : 58;
  let isPensioner = age >= pensionAge ? "да" : "нет";

  // Финальный alert
  let finalAnketa =
    "ваше ФИО: " +
    lastName +
    " " +
    firstName +
    " " +
    middleName +
    "\n" +
    "ваш возраст в годах: " +
    age +
    "\n" +
    "ваш возраст в днях: " +
    ageInDays +
    "\n" +
    "через 5 лет вам будет: " +
    ageAfter5Years +
    "\n" +
    "ваш пол: " +
    genderText +
    "\n" +
    "вы на пенсии: " +
    isPensioner;

  alert(finalAnketa);
}
