'use strict'; // строгий режим

// находим корни квадратного уравнения
// возвращает массив корней
function squareRoots(a,b,c) {
    // линейное или вырожденное
  if (a === 0) {

        // 0x + 0 = 0 → бесконечно много решений
        if (b === 0 && c === 0) {
        throw new Error('Бесконечно много решений');
        }

        // 0x + c = 0 → корней нет
        if (b === 0) return [];

        // bx + c = 0 → один корень
        return [ -c / b ];
    }

    const d=b*b-4*a*c; // дискриминант

    if ( d<0 )
        return []; // нет корней

    if ( d===0 )
        return [ -b/(2*a) ]; // один корень

    return [
      (-b + Math.sqrt(d)) / (2*a),
      (-b - Math.sqrt(d)) / (2*a)
    ];  
}

function ttt() {
    const a=Number(prompt('Введите a'));
    const b=Number(prompt('Введите b'));
    const c=Number(prompt('Введите c'));
    const roots=squareRoots(a,b,c);

    if ( !roots.length )
        alert('корней нет!');
    else if ( roots.length==1 )
        alert('один корень: '+roots[0]);
    else
        alert('два корня: '+roots[0]+' и '+roots[1]);
}
