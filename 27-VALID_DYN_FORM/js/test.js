// js/test.js

function assert(condition, message) {
  // если условие false — кидаем ошибку (так тест "падает")
  if (!condition) throw new Error(message);
}

// проверка обязательных полей по CSS-селектору
function assertRequiredFields(root, required) {
  required.forEach(({ selector, message }) => {
    assert(root.querySelector(selector), message);
  });
}

export function runTests() {
  // проверяем, что главная функция доступна глобально
  assert(
    typeof window.buildForm === "function",
    "Функция buildForm не найдена (проверь подключение creator.js)"
  );

  // создаём "виртуальную" форму (не на странице)
  const testForm = document.createElement("form");

  // запускаем генерацию
  window.buildForm(testForm);

  // Тест 1: форма не пустая
  assert(
    testForm.children.length > 0,
    "buildForm ничего не добавил в форму, ни одна строка НЕ СОЗДАНА"
  );

  // Тест 2: проверяем наличие всех обязательных полей
  assertRequiredFields(testForm, [
    {
      selector: 'input[type="text"][name="developers"]',
      message: "поле developers (text) НЕ СОЗДАНО",
    },
    {
      selector: 'input[type="text"][name="siteName"]',
      message: "поле siteName (text) НЕ СОЗДАНО",
    },
    {
      selector: 'input[type="url"][name="siteUrl"]',
      message: "поле siteUrl (url) НЕ СОЗДАНО",
    },
    {
      selector: 'input[type="date"][name="launchDate"]',
      message: "поле launchDate (date) НЕ СОЗДАНО",
    },
    {
      selector: 'input[type="number"][name="visitors"]',
      message: "поле visitors (number) НЕ СОЗДАНО",
    },
    {
      selector: 'input[type="email"][name="email"]',
      message: "поле email (email) НЕ СОЗДАНО",
    },
    {
      selector: 'select[name="catalog"]',
      message: "поле catalog (select) НЕ СОЗДАНО",
    },
    {
      selector: 'input[type="radio"][name="placement"]',
      message: "поле placement (radio) НЕ СОЗДАНО",
    },
    {
      selector: 'input[type="checkbox"][name="reviews"]',
      message: "поле reviews (checkbox) НЕ СОЗДАНО",
    },
    {
      selector: 'textarea[name="description"]',
      message: "поле description (textarea) НЕ СОЗДАНО",
    },
  ]);

  // Тест 3: последний элемент — submit-кнопка
  const last = testForm.lastElementChild;
  assert(
    last.tagName === "BUTTON",
    "Последний элемент должен быть BUTTON, кнопка НЕ СОЗДАЛАСЬ!"
  );
  assert(last.type === "submit", "Последняя кнопка должна быть type='submit'");

  // если дошли сюда — всё ок
  console.log("Все тесты прошли");
  //   alert("Все тесты прошли");
}
