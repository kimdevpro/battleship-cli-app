const readlineSync = require('readline-sync');
const { Table } = require('console-table-printer');
const boardOptions = ['3 X 3', '4 X 4', '5 X 5', '6 X 6'];
let boardSize;

function greetUser() {
    console.log("\nWelcome to Battleship 🚢");

    const index = readlineSync.keyInSelect(boardOptions, 'Choose a board size? ');
    
    if (index === -1) {
        console.log(`\nExiting game as requested..`);
        process.exit();
    }

    boardSize = parseInt(boardOptions[index].split('X')[0].trim(), 10);
    console.log(`\nYou selected board size: ${boardOptions[index]}`);
}

function setSymbol(cell, debug) {
    let symbol = "-";

    if (debug == true) {
        if (cell.type == "large") {
            symbol = '🔵' // show large ship
        }
        else if (cell.type == "small") {
            symbol = '🟠'; // show small ship
        }
    }
    if (debug == false) {
        if (cell.hit == true) {
            symbol = "❗" // show miss
        }
    }
    return symbol;
}

function printBoard(board, debug = false) {
    const rowCount = board.length;
    const colCount = Math.max(...board.map(row => row.length));
    const rowLabels = Array.from({ length: rowCount }, (_, i) => String.fromCharCode(65 + i));

    // Column headers: '', '1', '2', '3', ...
    const headers = [''].concat(Array.from({ length: colCount }, (_, i) => (i).toString()));
    const currentBoard = new Table({
        title: 'Game Board',
        columns: headers.map(name => ({ name, alignment: 'center' }))
    });

    for (let row = 0; row < rowCount; row++) {
        const rowLabel = rowLabels[row];
        const rowData = { '': rowLabel };

        for (let col = 0; col < colCount; col++) {
            const cell = board[row][col];

            symbol = setSymbol(cell, debug);
            rowData[(col).toString()] = symbol;
        }
        currentBoard.addRow(rowData);
    }
    console.log("\n");
    currentBoard.printTable();
}

    
const board1 = [
    [{ type: "large", hit: false }, { type: "small", hit: false }, { type: "small", hit: false }],
    [{ type: "large", id: 1, hit: false }, { type: "empty", hit: false }, { type: "empty", hit: false }],
    [{ type: "large", id: 1, hit: false }, { type: "empty", hit: false }, { type: "empty", hit: false }],
]

const board2 = [
    [{ type: "large", hit: false }, { type: "small", hit: false }, { type: "small", hit: false }],
    [{ type: "large", id: 1, hit: false }, { type: "empty", hit: false }, { type: "empty", hit: false }],
    [{ type: "large", id: 1, hit: false }, { type: "empty", hit: false }, { type: "empty", hit: false }],
]

const board3 = [
    [{ type: "large", hit: false }, { type: "small", hit: false }, { type: "small", hit: false }],
    [{ type: "large", id: 1, hit: false }, { type: "empty", hit: false }, { type: "empty", hit: false }],
    [{ type: "large", id: 1, hit: false }, { type: "empty", hit: false }, { type: "empty", hit: false }],
]

greetUser();

//printBoard(board1, true);
//printBoard(board1, false);


