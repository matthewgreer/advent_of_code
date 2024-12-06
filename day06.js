/*
input: "map" of a patrolling "guard". it is a string representing a grid of "." positions. some positions are marked with a "#" to indicate an obstacle, and one is marked with a "^" to indicate the "guard", who is facing up. the guard moves according to the following rules:
  - if there is something directly in front of you, turn right 90 degrees
  - otherwise, take a step forward

output: will be a number representing the count of distinct positions, including the guard's starting position, that the guard will visit before leaving the mapped area.
*/

import getInput from './shared/getInput.js';

const input = await getInput(6);

const VECTORS = {
  0: [-1, 0], // up
  1: [0, 1],  // right
  2: [1, 0],  // down
  3: [0, -1]  // left
}

const startingGridAndGuard = (inputString) => {
  let rows = inputString.split('\n');
  rows = rows.slice(0, rows.length - 1); // trim blank space at end

  let startingGuardV = 0,
      startingGuardX,
      startingGuardY;

  const startingGrid = rows.map(row => {
    if (row.includes('^')) {
      [startingGuardX, startingGuardY] = [rows.indexOf(row), row.indexOf('^')];
    }

    return row.split('')
  });

  return [startingGrid, startingGuardV, startingGuardX, startingGuardY];
};

const countGuardedPositions = (grid, guardV, guardX, guardY) => {
  const numRows = grid.length,
        numCols = grid[0].length,
        guardedPositions = new Set();

  while (guardX >= 0 && guardX < numRows && guardY >= 0 && guardY < numCols) {
    guardedPositions.add(`X${guardX}Y${guardY}`);

    let guardDir = VECTORS[guardV],
    nextX = guardX + guardDir[0],
    nextY = guardY + guardDir[1];

    if (nextX < 0 || nextX >= numRows || nextY < 0 || nextY >= numCols) break;

    let nextPos = grid[nextX][nextY];

    if (nextPos === "#") {
      guardV = (guardV + 1) % 4;
    } else {
      guardX = nextX;
      guardY = nextY;
    }
  }

  return guardedPositions.size;
};

const hasLoop = (grid, guardV, guardX, guardY) => {
  const visitedPositions = new Set();

  while (guardX >= 0 && guardX < numRows && guardY >= 0 && guardY < numCols) {
    if (visitedPositions.has(`V${guardV}X${guardX}Y${guardY}`)) return true;

    visitedPositions.add(`V${guardV}X${guardX}Y${guardY}`);

    let guardDir = VECTORS[guardV],
      nextX = guardX + guardDir[0],
      nextY = guardY + guardDir[1];
    if (nextX < 0 || nextX >= numRows || nextY < 0 || nextY >= numCols) return false;

    let nextPos = grid[nextX][nextY];

    if (nextPos === "#") {
      guardV = (guardV + 1) % 4;
    } else {
      guardX = nextX;
      guardY = nextY;
    }
  }

  return false;
};

const countLoops = (startingGrid, v, x, y) => {
  let count = 0;

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let grid = startingGrid.slice();
      if (grid[i][j] === "#") continue;
      else grid[i][j] = "#";

      if (hasLoop(grid, v, x, y)) count++;
    }
  }

  return count;
};


console.log(countGuardedPositions(...startingGridAndGuard(input)));
// console.log(countLoops(...startingGridAndGuard(input)));

const testGrid = "....#.....\n.........#\n..........\n..#.......\n.......#..\n..........\n.#..^.....\n........#.\n#.........\n......#...\n"

// console.log(startingGridAndGuard(testGrid));

// console.log(countGuardedPositions(...startingGridAndGuard(testGrid)));
// console.log(countLoops(...startingGridAndGuard(testGrid)));


