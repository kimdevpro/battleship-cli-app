import chalk from 'chalk';
import Table from 'cli-table3';

export function greetUser() {
    console.clear();
    console.log(`
==============================
Welcome to Battleship 🚢
==============================
Choose a Board Size:
`);
}

export function winningMessage() {
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

export function guessResults(status) {
    console.clear();
    if (status === "invalid" || status === "repeat") console.log("\n⚠️  Invalid or repeated guess. Try again.\n");
    if (status === "miss") console.log("\n💥 MISS!\n");
    else if (status === "hit") console.log("\n🎯 HIT!\n");
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

export function printBoard(board, title, debug = false) {
    const rowLabels = Array.from({ length: board.length }, (_, i) => String.fromCharCode(65 + i));
    const headers = [''].concat([...Array(board.length).keys()].map(i => chalk.blueBright(i.toString())));
    const table = new Table({ head: headers, colAligns: new Array(headers.length).fill('center') });

    board.forEach((row, i) => {
        table.push([rowLabels[i], ...row.map(cell => setSymbol(cell, debug))]);
    });

    console.log(chalk.yellowBright.bold(title));
    console.log(table.toString());
}
