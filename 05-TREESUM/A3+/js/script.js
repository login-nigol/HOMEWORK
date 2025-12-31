//
function isPalindrome(phrase) {
  const cleanPhrase = phrase
    .toLowerCase()
    .replace(/ё/g, "е") // меняем ё на е
    .replace(/[\sъь.,!?—:;]/g, ""); // игнорируем эти знаки

  let left = 0;
  let right = cleanPhrase.length - 1;

  while (left < right) {
    if (cleanPhrase[left] !== cleanPhrase[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

let userInput = prompt("Введите фразу для проверки на палиндром:");

if (userInput === null) {
  alert("Вы не ввели фразу для проверки!");
} else if (userInput.trim() === "") {
  alert("Пустая строка!");
} else {
  alert(isPalindrome(userInput) ? "Это палиндром" : "Это не палиндром");
}

console.log(isPalindrome("А роза упала на лапу Азора"));
console.log(isPalindrome("Привет мир"));
