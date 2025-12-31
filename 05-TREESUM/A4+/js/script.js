// очистка строки
function cleanPhrase(phrase) {
  return phrase
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[ъь\s\p{P}\p{Z}]/gu, "");
}

// рекурсивная проверка палиндрома
function isPalindromeRecursive(str) {
  if (str.length <= 1) {
    return true;
  }

  //   if (str[0] !== str[str.length - 1]) {
  //     return false;
  //   }

  // рекурсией проверяем внутреннюю часть строки
  return (
    str[0] === str[str.length - 1] && isPalindromeRecursive(str.slice(1, -1))
  );
}

// Facade Pattern(фасад) - упрощённый интерфейс для сложной логики,
// сокрытие сложности - пользователь не видит внутренней кухни
function checkPalindrome(phrase) {
  const cleaned = cleanPhrase(phrase);
  return isPalindromeRecursive(cleaned);
}

// обработчик на кнопку
document.getElementById("checkBtn").addEventListener("click", function () {
  const userInput = prompt("Введите фразу для проверки на палиндром:");

  if (userInput === null) {
    alert("Вы отменили ввод!");
    return;
  }
  if (userInput.trim() === "") {
    alert("Вы ввели пустую строку!");
    return;
  } else {
    const isPal = checkPalindrome(userInput);
    alert(isPal ? "это палиндром!" : "это не палиндром");
  }
});

console.log("Тест 3:", checkPalindrome("Привет мир")); // false
console.log("Тест 4:", checkPalindrome("Ёлка - аклё!")); // true (ё заменяется на е)
