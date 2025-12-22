// data.js
// форма 1
const formDef1 = [
  { label: "Название сайта:", kind: "longtext", name: "sitename" },
  { label: "URL сайта:", kind: "longtext", name: "siteurl" },
  { label: "Посетителей в сутки:", kind: "number", name: "visitors" },
  { label: "E-mail для связи:", kind: "shorttext", name: "email" },
  {
    label: "Рубрика каталога:",
    kind: "dropdown",
    name: "division",
    variants: [
      { text: "здоровье", value: 1 },
      { text: "домашний уют", value: 2 },
      { text: "бытовая техника", value: 3 },
    ],
  },
  {
    label: "Размещение:",
    kind: "radio",
    name: "payment",
    variants: [
      { text: "бесплатное", value: 1 },
      { text: "платное", value: 2 },
      { text: "VIP", value: 3 },
    ],
  },
  { label: "Разрешить отзывы:", kind: "check", name: "votes" },
  { label: "Описание сайта:", kind: "memo", name: "description" },
  { caption: "Опубликовать", kind: "submit" },
];

// форма 2
const formDef2 = [
  { label: "Фамилия:", kind: "longtext", name: "lastname", placeholder: 'Антипов' },
  { label: "Имя:", kind: "longtext", name: "firstname", placeholder: 'Вадим' },
  { label: "Отчество:", kind: "longtext", name: "secondname", placeholder: 'Евгеньевич' },
  { label: "Возраст:", kind: "number", name: "age", placeholder: 45 },
  { caption: "Зарегистрироваться", kind: "submit" },
];

export { formDef1, formDef2 };
