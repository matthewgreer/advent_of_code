/*
input: "map" of a patrolling "guard". it is a string representing a grid of "." positions. some positions are marked with a "#" to indicate an obstacle, and one is marked with a "^" to indicate the "guard", who is facing up. the guard moves according to the following rules:
  - if there is something directly in front of you, turn right 90 degrees
  - otherwise, take a step forward

output: will be a number representing the count of distinct positions, including the guard's starting position, that the guard will visit before leaving the mapped area.
*/

import getInput from './shared/getInput.js';

const input = await getInput(6);
let rows = input.split('\n');
rows = rows.slice(0, rows.length - 1); // trim blank space at end

const VECTORS = {
  0: [-1, 0], // up
  1: [0, 1],  // right
  2: [1, 0],  // down
  3: [0, -1]  // left
}
let guardV = 0,
    guardX,
    guardY;

const startingGrid = rows.map(row => {
  if (row.includes('^')) {
    [guardX, guardY] = [rows.indexOf(row), row.indexOf('^')];
  }
  return row.split('')
});

let grid = startingGrid.slice(),
    count = 0;

console.log("START: ", "guardX: ", guardX, "guardY: ", guardY);

while (guardX >= 0 && guardX < rows.length && guardY >= 0 && guardY < rows[0].length) {
  if (grid[guardX][guardY] !== "x") {
    count++;
    grid[guardX][guardY] = "x";
  }

  let guardDir = VECTORS[guardV],
      nextX = guardX + guardDir[0],
      nextY = guardY + guardDir[1],
      nextPos = grid[nextX][nextY];

  if (nextPos === "#") {
    guardV = (guardV + 1) % 4;
  } else {
    guardX = nextX;
    guardY = nextY;
  }
}

console.log(count);
