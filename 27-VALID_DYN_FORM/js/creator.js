// creator
const fieldDev = formDef[0]; // первое поле: developers
const fieldSiteTitle = formDef[1];
const fieldUrl = formDef[2];
const fieldDate = formDef[3];
const fieldVisitors = formDef[4];
const fieldEmail = formDef[5];
const fieldCatalog = formDef[6];
const fieldPlacement = formDef[7];
const fieldReviews = formDef[8];
const fieldDescription = formDef[9]; // описание сайта

function createFormRow(field) {
  // создаём форму - form-row
  const row = document.createElement("div");
  row.className = "form-row";

  // создаём поле label, для всех элементов!
  const label = document.createElement("label");
  label.textContent = field.label;

  // режим вывода ошибки
  const insideErrorNames = ["developers", "siteName", "siteUrl", "email", "description"];
  // inside — значок внутри поля (absolute)
  if (insideErrorNames.includes(field.name)) {
    row.classList.add("form-row--error-inside");
  } else {
    // outside — значок справа от поля (в потоке)
    row.classList.add("form-row--error-outside");
  }

  // --- control: input, select или radio ---
  let control;

  // если select
  if (field.type === "select") {
    const select = document.createElement("select");
    select.name = field.name;
    select.id = field.name;

    // создай options - выпадающее меню
    field.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      select.append(option);
    });

    control = select;
    label.htmlFor = control.id;
  }

  // если radio - создаём радио-кнопки
  else if (field.type === "radio") {
    const group = document.createElement("div");
    group.className = "radio-group";

    field.options.forEach((opt, i) => {
      const id = `${field.name}_${i}`;

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = field.name;
      radio.value = opt.value;
      radio.id = id;

      const radioLabel = document.createElement("label");
      radioLabel.htmlFor = id;
      radioLabel.textContent = opt.text;

      group.append(radio, radioLabel);
    });

    control = group; // id тут не нужен
  }

  // если textarea - создаём поле для текста
  else if (field.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.name = field.name;
    textarea.id = field.name;

    control = textarea;
    label.htmlFor = control.id; // связь label→textarea

    // тогда поле ввода - input
  } else {
    const input = document.createElement("input");
    input.type = field.type;
    input.name = field.name;
    input.id = field.name;

    control = input;
    label.htmlFor = control.id; // связь label→input
  }

  // span для ошибки
  const error = document.createElement("span");
  error.className = "form-error";
  error.textContent = "!"; // значок (через display)

  const inputWrap = document.createElement("div");
  inputWrap.className = "input-wrap";
  inputWrap.append(control, error);

  // строка для select (Рубрика каталога)
  if (field.name === "catalog") {
    row.classList.add("form-row-catalog");
  }

  if (field.name === "siteUrl") {
    row.classList.add("form-row-url");
  }

  if (field.name === "launchDate") {
    row.classList.add("form-row-date");
  }

  // узкое числовое поле
  if (field.name === "visitors") {
    row.classList.add("form-row-visitors");
  }

  if (field.name === "email") {
    row.classList.add("form-row-email");
  }

  // метка строки radio
  if (field.name === "placement") row.classList.add("form-row-radio");

  // строка checkbox
  if (field.name === "reviews") {
    row.classList.add("form-row-checkbox");
  }

  if (field.type === "textarea") {
    row.classList.add("form-row-textarea");
  }

  row.append(label, inputWrap);
  return row;
}

// кнопка публикации формы
const submit = document.createElement("button");
submit.type = "submit";
submit.textContent = "Опубликовать";

function buildForm(form) {
  form.append(
    createFormRow(fieldDev),
    createFormRow(fieldSiteTitle),
    createFormRow(fieldUrl),
    createFormRow(fieldDate),
    createFormRow(fieldVisitors),
    createFormRow(fieldEmail),
    createFormRow(fieldCatalog),
    createFormRow(fieldPlacement),
    createFormRow(fieldReviews),
    createFormRow(fieldDescription),

    submit
  );
}
