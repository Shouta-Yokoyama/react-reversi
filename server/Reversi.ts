const rayToCoords = (x: number, y: number, a: number, b: number) => {
  const areaContains = (x: number, y: number) =>
    x >= 0 && x < 8 && y >= 0 && y < 8;
  const coords: number[][] = [];
  while (areaContains(x, y)) {
    coords.push([x, y]);
    x += a;
    y += b;
  }
  return coords;
};

const coordsToDisks = (coords: number[][], board: number[][]) => {
  return coords.map((c) => board[c[0]][c[1]]);
};

const nFlippable = (disk: number, vec: number[]) => {
  if (vec.length <= 2 || vec[0] !== 0) return 0;
  for (let i = 1; i < vec.length; i++) {
    if (vec[i] === 0) {
      return 0;
    } else if (vec[i] === disk) {
      return i - 1;
    }
  }
  return 0;
};

const coordsFlippable = (
  disk: number,
  x: number,
  y: number,
  board: number[][]
) => {
  return [...new Array(8).keys()]
    .map((n) => [
      Math.round(Math.cos((n * Math.PI) / 4)),
      Math.round(Math.sin((n * Math.PI) / 4)),
    ])
    .map((way) => rayToCoords(x, y, way[0], way[1]))
    .map((coords) =>
      coords.slice(1, 1 + nFlippable(disk, coordsToDisks(coords, board)))
    )
    .flat();
};

const setDisk = (
  currentTurnDisk: number,
  posX: number,
  posY: number,
  board: number[][]
) => {
  let coords = coordsFlippable(currentTurnDisk, posX, posY, board);
  if (coords.length === 0) return;

  for (let c of [...coords, [posX, posY]]) board[c[0]][c[1]] = currentTurnDisk;

  return board;
};

const findSettablePlace = (disk: number, board: number[][]) => {
  let xyProduct: number[][] = [];
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) xyProduct.push([x, y]);

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

export { findSettablePlace, setDisk };

