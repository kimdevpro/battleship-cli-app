import readlineSync from 'readline-sync';
import { printBoard, guessResults, winningMessage } from './ui.js';
import { isShipSunk } from './board.js';

let sunkShips = new Set();


export function parseGuess(input, boardSize) {
    if (!/^[A-Z][0-9]+$/i.test(input)) return null;
    const row = input[0].toUpperCase().charCodeAt(0) - 65;
    const col = parseInt(input.slice(1), 10);
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return null;
    return { row, col };
}

export function handleGuess(board, input) {
    const parsed = parseGuess(input, board.length);
    if (!parsed) return "invalid";

    const { row, col } = parsed;
    const cell = board[row][col];
    if (cell.hit) return "repeat";

    cell.hit = true;
    let status = "miss";

    if (cell.type !== "empty") {
        status = "hit";
        if (!sunkShips.has(cell.id) && isShipSunk(board, cell.id)) {
            sunkShips.add(cell.id);
        }
    }
    return status;
}

export function gameLoop(board, debug = false) {
    const sunkShips = new Set();
    const totalShipCells = board.flat().filter(cell => cell.type !== "empty").length;
    let totalHits = 0;

    while (totalHits < totalShipCells) {
        printBoard(board, "\nGame Board", false);
        if (debug) printBoard(board, "\nDebug Game Board", true);

        const guess = readlineSync.question("\nEnter your guess (e.g., A1): ").toUpperCase();
        const status = handleGuess(board, guess, sunkShips);
        console.log(`status: ${status}`);
        guessResults(status);

        totalHits = board.flat().filter(cell => cell.hit && cell.type !== "empty").length;
    }

    winningMessage();
    printBoard(board, "\nFinal Game Board");
    if (debug) printBoard(board, "\nDebug Game Board", true);
}
