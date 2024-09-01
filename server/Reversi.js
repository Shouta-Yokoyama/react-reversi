"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDisk = exports.findSettablePlace = void 0;
const rayToCoords = (x, y, a, b) => {
    const areaContains = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;
    const coords = [];
    while (areaContains(x, y)) {
        coords.push([x, y]);
        x += a;
        y += b;
    }
    return coords;
};
const coordsToDisks = (coords, board) => {
    return coords.map((c) => board[c[0]][c[1]]);
};
const nFlippable = (disk, vec) => {
    if (vec.length <= 2 || vec[0] !== 0)
        return 0;
    for (let i = 1; i < vec.length; i++) {
        if (vec[i] === 0) {
            return 0;
        }
        else if (vec[i] === disk) {
            return i - 1;
        }
    }
    return 0;
};
const coordsFlippable = (disk, x, y, board) => {
    return [...new Array(8).keys()]
        .map((n) => [
        Math.round(Math.cos((n * Math.PI) / 4)),
        Math.round(Math.sin((n * Math.PI) / 4)),
    ])
        .map((way) => rayToCoords(x, y, way[0], way[1]))
        .map((coords) => coords.slice(1, 1 + nFlippable(disk, coordsToDisks(coords, board))))
        .flat();
};
const setDisk = (currentTurnDisk, posX, posY, board) => {
    let coords = coordsFlippable(currentTurnDisk, posX, posY, board);
    if (coords.length === 0)
        return;
    for (let c of [...coords, [posX, posY]])
        board[c[0]][c[1]] = currentTurnDisk;
    return board;
};
exports.setDisk = setDisk;
const findSettablePlace = (disk, board) => {
    let xyProduct = [];
    for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++)
            xyProduct.push([x, y]);
    let settablePlace = xyProduct
        .map((xy) => {
        const x = xy[0];
        const y = xy[1];
        return [x, y, coordsFlippable(disk, x, y, board).length];
    })
        .filter((xyf) => xyf[2] !== 0);
    //console.log(settablePlace);
    return settablePlace;
};
exports.findSettablePlace = findSettablePlace;
