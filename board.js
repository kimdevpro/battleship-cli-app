export function generateEmptyBoard(size) {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ type: "empty", hit: false }))
    );
}

export function isShipSunk(board, shipId) {
    for (let row of board) {
        for (let cell of row) {
            if (cell.id === shipId && cell.hit === false) return false;
        }
    }
    return true;
}