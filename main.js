import readlineSync from 'readline-sync';
import { greetUser } from './ui.js';
import { generateEmptyBoard } from './board.js';
import { generateGameBoard } from './ships.js';
import { gameLoop } from './gameLoop.js';

const boardConfigs = {
    3: { small: 1, large: 0 },
    4: { small: 1, large: 1 },
    5: { small: 2, large: 1 },
    6: { small: 2, large: 2 },
};

const label = (size) => `${size}x${size} Game Board`;
const boardOptions = Object.entries(boardConfigs).map(([size, config]) => ({
    label: label(size),
    value: parseInt(size),
    config,
}));

function startBattleship() {
    greetUser();
    const index = readlineSync.keyInSelect(
        boardOptions.map(option => option.label),
        'Enter board size:'
    );

    if (index === -1) {
        console.log("❌  Game cancelled.");
        return;
    }

    const boardSizeChoice = boardOptions[index];
    console.log(`\n✅ You selected a ${boardSizeChoice.label}\n`);
    console.log(`Generating your ${boardSizeChoice.label} ...\n`);
    let gameBoard = generateEmptyBoard(boardSizeChoice.value);
    gameBoard = generateGameBoard(gameBoard, boardSizeChoice.config);
    gameLoop(gameBoard);
}

startBattleship();