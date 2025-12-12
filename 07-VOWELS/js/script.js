//
const str = "aeiouyаеёиоуыэюяAEIOUYАЕЁИОУЫЭЮЯ";
const vowels = {};

for (let i = 0; i < str.length; i++) {
  vowels[str[i]] = true;
}

const translitMap = {
    'а':'a','А':'A','б':'b','Б':'B','в':'v','В':'V',
    'г':'g','Г':'G','д':'d','Д':'D','е':'e','Е':'E',
    'ё':'yo','Ё':'Yo','ж':'zh','Ж':'Zh','з':'z','З':'Z',
    'и':'i','И':'I','й':'y','Й':'Y','к':'k','К':'K',
    'л':'l','Л':'L','м':'m','М':'M','н':'n','Н':'N',
    'о':'o','О':'O','п':'p','П':'P','р':'r','Р':'R',
    'с':'s','С':'S','т':'t','Т':'T','у':'u','У':'U',
    'ф':'f','Ф':'F','х':'kh','Х':'Kh','ц':'ts','Ц':'Ts',
    'ч':'ch','Ч':'Ch','ш':'sh','Ш':'Sh','щ':'shch','Щ':'Shch',
    'ъ':'','Ъ':'','ы':'y','Ы':'Y','ь':'','Ь':'',
    'э':'e','Э':'E','ю':'yu','Ю':'Yu','я':'ya','Я':'Ya'
};

function vowelsCount(input) {
  let vowelsTotal = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char in vowels) {
      vowelsTotal++;
    }
  }
  return vowelsTotal;
}

function transliterate(input) {
    let translit = "";

    for ( let i = 0; i < input.length; i++) {
        const ingChar = input[i];

        if ( ingChar in translitMap ) {
            translit += translitMap[ingChar];
        } else {
            translit += ingChar;
        }
    }
    return translit;
}


function countVowels() {
  const userText = prompt("Введите текст:");
  if (userText === null) return alert("Отменено!");
  if (userText.trim() === "") return alert("Пустая строка!")

  const vowelsOriginal = vowelsCount(userText);
  const transliterated = transliterate(userText);
  const vowelsTranslit = vowelsCount(transliterated);

  const result = `
  Оригинал: "${userText}"
  Гласных: ${vowelsOriginal}
  
  Транслит: "${transliterated}"
  Гласных в транслите "${vowelsTranslit}"
  `;

  alert(result);
  console.log(result);
}

document.getElementById("countBtn").onclick = countVowels;
