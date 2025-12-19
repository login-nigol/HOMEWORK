// генератор рандомных чисел
function randomDiap(n, m) {
  return Math.floor(Math.random() * (m - n + 1)) + n;
}

function mood(colorCount) {
    const colors=[ '', 'красный', 'оранжевый', 'жёлтый', 'зелёный', 'голубой', 'синий', 'фиолетовый' ];
    
    if ( colorCount > 7 ) {  // защита от бесконечного цикла
        console.log('Максимум 7 цветов!');
        alert( 'Максимум 7 цветов!' );
        return null; // возвращаем null как флаг ошибки
    }

    console.log('цветов: ' + colorCount);
    let used={}; // ключ - номер цвета
    let result = 'цветов: ' + colorCount + '\n';

    for ( let i=1; i<=colorCount; i++ ) {
        let n;
        do {
            n=randomDiap(1,7);
        } while ( n in used );
        used[n]=true;
        const colorName=colors[n];
        // console.log( i + " " + colorName );
        result += i + ' ' + colorName + '\n';
    }
    return result;
}

// mood(3);

document.getElementById('runBtn').addEventListener('click', function() {
    const count = parseInt(document.getElementById('countInput').value);
    const output = document.getElementById('output');

    const result = mood( count );
    
    if (result !== null) {
    output.textContent = result;
    console.clear();
    console.log( result ); // дублируем в консоль
    } else {
        output.textContent = ''; // очищаем вывод при ошибке
    }
});
