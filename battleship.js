const readlineSync = require('readline-sync');
const { Table } = require('console-table-printer');

function createBoard(rows, cols, defaultValue = '-') {
  const grid = {};
  
  for (let i = 0; i < rows; i++) {
    const rowLabel = String.fromCharCode(65 + i); // Converts 0 -> 'A', 1 -> 'B', ...
    grid[rowLabel] = Array(cols).fill(defaultValue);
  }

  return grid;
}

function printBoard(grid) {
    const rowLabels = Object.keys(grid);
    const colCount = grid[rowLabels[0]].length;

    const headers = [''].concat(Array.from({ length: colCount }, (_, i) => (i + 1).toString()));
    const table = new Table({ columns: headers.map(name => ({ name, alignment: 'center' })) });

    for (const row of rowLabels) {
        const rowData = { '': row }; 
        grid[row].forEach((val, i) => {
            rowData[(i + 1).toString()] = val;
        });
        table.addRow(rowData);
    }
    table.printTable();
}
    
function greetUser() {
    console.log("\nWelcome to Battleship 🚢");
    boards = ['4 X 4', '5 X 5', '6 X 6'];
    index = readlineSync.keyInSelect(boards, 'Choose a board size? ');
    return boards[index];
}

// const boardSize = parseInt(greetUser().split('X')[0].trim(), 10);
boardSize = 4;
gameBoard = createBoard(boardSize, boardSize);
printBoard(gameBoard, true);
