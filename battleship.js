import readlineSync from 'readline-sync';
import chalk from 'chalk';
import Table from 'cli-table3';

// === Global Variables ===
let gameBoard = [];
let debug = false;
let selectedConfig = "";


function winningMessage() {
  const winningArt = `
============================================
__   _______ _   _   _    _ _____ _   _
\\ \\ / /  _  | | | | | |  | |_   _| \\ | |
 \\ V /| | | | | | | | |  | | | | |  \\| |
  \\ / | | | | | | | | |/\\| | | | | . ' |
  | | \\ \\_/ / |_| | \\  /\\  /_| |_| |\\  |
  \\_/  \\___/ \\___/   \\/  \\/ \\___/\\_| \\_/
============================================
      🏆 Congratulations, Commander! 🏆
        You sank all the enemy ships!
`;
  console.log(chalk.greenBright.bold(winningArt));
}
// === Board Configurations ===
const boardConfigs = [
  { size: 3, label: "3x3 Game Board", small: 1, large: 0 },
  { size: 4, label: "4x4 Game Board", small: 1, large: 1 },
  { size: 5, label: "5x5 Game Board", small: 2, large: 1 },
  { size: 6, label: "6x6 Game Board", small: 2, large: 2 },
];

// === Board Helpers ===
function generateEmptyBoard(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ type: "empty", hit: false }))
  );
}

function setSymbol(cell, debug = false) {
  if (debug) {
    if (cell.type === "large") return '🔵';
    if (cell.type === "small") return '🟠';
  } else {
    if (cell.hit) {
      if (cell.type === "large") return '🔵';
      if (cell.type === "small") return '🟠';
      return '❗';
    }
  }
  return `-`;
}

function printBoard(board, title, debug = false) {
  const rowCount = board.length;
  const colCount = Math.max(...board.map(row => row.length));
  const rowLabels = Array.from({ length: rowCount }, (_, i) => String.fromCharCode(65 + i));
  
  // Format title with chalk
  title = chalk.yellowBright.bold(title); 
  console.log(title);

  // Define headers (column titles)
  const headers = [''].concat(Array.from({ length: colCount }, (_, i) => chalk.blueBright(i.toString())));

  // Initialize table with headers and column alignment
  const currentBoard = new Table({
    head: headers,
    colAligns: new Array(headers.length).fill('center')
  });

  // Add each row to the table
  for (let row = 0; row < rowCount; row++) {
    const rowLabel = rowLabels[row];
    const rowData = [rowLabel];

    for (let col = 0; col < colCount; col++) {
      const cell = board[row][col];
      const symbol = setSymbol(cell, debug);
      rowData.push(symbol);
    }

    currentBoard.push(rowData);
  }
  
  console.log(currentBoard.toString());
}

function isShipSunk(board, shipId) {
  for (let row of board) {
    for (let cell of row) {
      if (cell.id === shipId && cell.hit === false) return false;
    }
  }
  return true;
}

// === UI ===
function greetUser(configs) {
  console.clear();
  console.log(`
==============================
Welcome to Battleship 🚢
==============================

Choose a Board Size:
`);

  configs.forEach(cfg => {
    console.log(`  ${cfg.size} - ${cfg.label}`);
  });

  const range = configs.map(cfg => cfg.size).join(", ");
  console.log(`\nType one of the following: ${range}\n`);
}

function getBoardSelection(configs) {
  const validSizes = configs.map(cfg => String(cfg.size));
  greetUser(configs);

  while (true) {
    const input = readlineSync.question("Enter board size: ").trim();
    if (validSizes.includes(input)) {
      return configs.find(cfg => String(cfg.size) === input);
    }
    console.log("\n❌\tInvalid input. Please enter one of the listed numbers.\n");
  }
}

// === Ship Placement ===
function placeShip(board, length, type, id) {
  const size = board.length;
  let placed = false;

  while (!placed) {
    const isVertical = Math.random() < 0.5;
    const startRow = Math.floor(Math.random() * (isVertical ? size - length + 1 : size));
    const startCol = Math.floor(Math.random() * (isVertical ? size : size - length + 1));

    let canPlace = true;
    for (let i = 0; i < length; i++) {
      const r = startRow + (isVertical ? i : 0);
      const c = startCol + (isVertical ? 0 : i);
      if (board[r][c].type !== "empty") {
        canPlace = false;
        break;
      }
    }

    if (canPlace) {
      for (let i = 0; i < length; i++) {
        const r = startRow + (isVertical ? i : 0);
        const c = startCol + (isVertical ? 0 : i);
        board[r][c] = { type, id, hit: false };
      }
      placed = true;
    }
  }

  return board;
}

function generateGameBoard(board, config) {
  for (let i = 0; i < config.small; i++) {
    board = placeShip(board, 2, "small", i + 1);
  }
  for (let i = 0; i < config.large; i++) {
    board = placeShip(board, 3, "large", i + 100);
  }
  return board; 
}

function parseGuess(input, boardSize) {
  if (!/^[A-Z][0-9]+$/i.test(input)) return null;

  const rowChar = input[0].toUpperCase();
  const row = rowChar.charCodeAt(0) - 65;
  const col = parseInt(input.slice(1), 10);

  if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return null;

  return { row, col };
}

function handleGuess(board, input, sunkShips = new Set()) {
  const parsed = parseGuess(input, board.length);
  if (!parsed) return { valid: false, status: "invalid" };

  const { row, col } = parsed;
  const cell = board[row][col];

  if (cell.hit) return { valid: false, status: "repeat" };

  cell.hit = true;

  let status = "miss";
  if (cell.type !== "empty") {
    status = "hit";
    if (!sunkShips.has(cell.id) && isShipSunk(board, cell.id)) {
      winningMessage();
      sunkShips.add(cell.id);
    }
  }

  return { valid: true, status, sunkShips };
}

function gameLoop(board) {
  const sunkShips = new Set();
  const totalShipCells = board.flat().filter(cell => cell.type !== "empty").length;
  let totalHits = 0;

  while (totalHits < totalShipCells) {
    printBoard(board, "\nGame Board", false);
    if (debug) {
      printBoard(board, "\nDebug Game Board", true);
    }
 
    const guess = readlineSync.question("\nEnter your guess (e.g., A1): ").toUpperCase();
    const result = handleGuess(board, guess, sunkShips);
    console.clear();
    if (!result.valid) {
      console.log("\n⚠️  Invalid or repeated guess. Try again.\n");
    } else if (result.status === "miss") {
      console.log("\n💥 MISS!\n");
    } else if (result.status === "hit") {
      console.log("\n🎯 HIT!\n");
    }

    totalHits = board.flat().filter(cell => cell.hit && cell.type !== "empty").length;
  }

  winningMessage();
  printBoard(board, "\nFinal Game Board");
  if (debug) {
    printBoard(board, "\nDebug Game Board", true);
  }
}

// === Game Start ===
selectedConfig = getBoardSelection(boardConfigs);
console.clear();
console.log(`\n✅ You selected a ${selectedConfig.label}\n`);
console.log(`Generating your ${selectedConfig.label} ...\n`);
gameBoard = generateEmptyBoard(selectedConfig.size);
gameBoard = generateGameBoard(gameBoard, selectedConfig);
gameLoop(gameBoard, debug);

