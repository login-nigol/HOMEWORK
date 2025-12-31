// data
const formDef = [
  { type: "text", name: "developers", label: "Разработчики:" },
  { type: "text", name: "siteName", label: "Название сайта:" },
  { type: "url", name: "siteUrl", label: "URL сайта:" },

  { type: "date", name: "launchDate", label: "Дата запуска сайта:" },

  { type: "number", name: "visitors", label: "Посетителей в сутки:" },
  { type: "email", name: "email", label: "E-mail для связи:" },

  {
    type: "select",
    name: "catalog",
    label: "Рубрика каталога:",
    options: [
      { value: "", text: "— выберите —" }, // пустое значение = ошибка
      { value: "tech", text: "бытовая техника" },
      { value: "auto", text: "авто" },
      { value: "sport", text: "спорт" },
    ],
  },

  {
    type: "radio",
    name: "placement",
    label: "Размещение:",
    options: [
      { value: "free", text: "бесплатное" },
      { value: "paid", text: "платное" },
      { value: "vip", text: "VIP" },
    ],
  },

  { type: "checkbox", name: "reviews", label: "Разрешить отзывы:" },
  { type: "textarea", name: "description", label: "Описание сайта:" },

  // { type: "submit", text: "Отправить" },
];
