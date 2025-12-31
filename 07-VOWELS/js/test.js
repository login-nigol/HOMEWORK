//
let a = [5, 6, 7];

for (let k in a) {
  // console.log(a[k]);
  // console.log([k]);
}

const beatles = {
  name: "Beatles",
  members: ["McCartney", "Lennon", "Harrison", "Starr"],
  albums: [
    { name: "Please Please Me", year: 1963 },
    { name: "With The Beatles", year: 1963 },
    { name: "A Hard Day's Night", year: 1964 },
  ],
};

// console.log( beatles );
// console.log(beatles.members);
// console.log(beatles.albums);

let myBoard = [
  ["x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x", "x"],
];

function showBoard(board) {
  console.log(" ---------------");
  for (let row = 0; row < board.length; row++) {
    let rowStr = row + 1 + ") ";
    for (let col = 0; col < board[row].length; col++)
      rowStr += board[row][col] + " ";
    console.log(rowStr);
  }
  console.log(" ---------------");
}

// showBoard(myBoard);

myBoard[1][3] = "Q";
// showBoard(myBoard);
myBoard[1][3] = "X";
// showBoard(myBoard);

const values = [55, 77, 55, 66, 77];
let used = {}; // ключ объекта - число, которое уже встречалось
for (let i = 0; i < values.length; i++) {
  const value = values[i]; // очередное значение
  if (value in used)
    // встречалось ли оно?
    continue; // если да - всё, берём следующее
  used[value] = true; // если нет - запоминаем, что это значение уже встречалось
  console.log(value); // выводим его в консоль
}
