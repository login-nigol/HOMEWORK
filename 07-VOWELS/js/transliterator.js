//
const chars = {
  а: "a",
  А: "A",
  б: "b",
  Б: "B",
  в: "v",
  В: "V",
  г: "g",
  Г: "G",
  д: "d",
  Д: "D",
  е: "e",
  Е: "E",
  ё: "yo",
  Ё: "Yo",
  ж: "zh",
  Ж: "Zh",
  з: "z",
  З: "Z",
  и: "i",
  И: "I",
  й: "y",
  Й: "Y",
  к: "k",
  К: "K",
  л: "l",
  Л: "L",
  м: "m",
  М: "M",
  н: "n",
  Н: "N",
  о: "o",
  О: "O",
  п: "p",
  П: "P",
  р: "r",
  Р: "R",
  с: "s",
  С: "S",
  т: "t",
  Т: "T",
  у: "u",
  У: "U",
  ф: "f",
  Ф: "F",
  х: "kh",
  Х: "Kh",
  ц: "ts",
  Ц: "Ts",
  ч: "ch",
  Ч: "Ch",
  ш: "sh",
  Ш: "Sh",
  щ: "shch",
  Щ: "Shch",
  ъ: "",
  Ъ: "",
  ы: "y",
  Ы: "Y",
  ь: "",
  Ь: "",
  э: "e",
  Э: "E",
  ю: "yu",
  Ю: "Yu",
  я: "ya",
  Я: "Ya",
};

function transliterate(text) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const ingChar = text[i];

    if (chars.hasOwnProperty(ingChar)) {
      result += chars[ingChar];
    } else {
      result += ingChar;
    }
  }
  return result;
}

console.log("--------------");
console.log(transliterate("Моё имя Вадим!"));
console.log(transliterate("Я люблю Беларуссию!"));
console.log("--------------");

const input = prompt("Введите русский текст для транслитерации:");

if (input != null) {
  const translated = transliterate(input);
  alert("Результат:\n${translated}");
  console.log("Оригинал:", input);
  console.log("Транслитерация:", translated);
} else {
  alert("Отмененно пользователем");
}
