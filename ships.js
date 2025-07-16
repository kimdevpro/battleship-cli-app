export function placeShip({ board, length, type, id }) {
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

export function generateGameBoard(board, config) {
    for (let i = 0; i < config.small; i++) {
        board = placeShip({ board, length: 2, type: "small", id: i + 1 });
    }
    for (let i = 0; i < config.large; i++) {
        board = placeShip({ board, length: 3, type: "large", id: i + 1 });
    }
    return board;
}
