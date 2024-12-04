/*  input is a large string representing a word search, with rows denoted by '\n', in which the word 'XMAS' appears many times. it can be written horizontally, vertically, diagonally, backwards, and overlapping other instances.

output is:
  1. the number of times xmas appears


*/

import getInput from "./shared/getInput.js";

const input = await getInput(4);
const rows = input.split("\n");
const numberOfRows = rows.length;
const numberOfCols = rows[0].length;

const countXmas = (rows) => {
  const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [1, 1],  // down-right
    [1, -1], // down-left
    [0, -1], // left
    [-1, 0], // up
    [-1, -1],// up-left
    [-1, 1]  // up-right
  ];
  const word = "XMAS";
  const wordLength = word.length;
  let count = 0;

  for (let i = 0; i < numberOfRows; i++) {
    for (let j = 0; j < numberOfCols; j++) {
      for (let [dx, dy] of directions) {
        let k;
        for (k = 0; k < wordLength; k++) {
          const x = i + k * dx;
          const y = j + k * dy;
          if (x < 0 || x >= numberOfRows || y < 0 || y >= numberOfCols || rows[x][y] !== word[k]) {
            break;
          }
        }
        if (k === wordLength) {
          count++;
        }
      }
    }
  }

  return count;
};

const countMasInXShape = (rows) => {
  // const diagonals = [
  //   [
  //     [-1, -1], // up-left
  //     [1, 1]    // down-right
  //   ],
  //   [
  //     [-1, 1],  // up-right
  //     [1, -1]   // down-left
  //   ],
  // ];
  let count = 0;

  for (let i = 1; i < numberOfRows - 1; i++) {
    for (let j = 1; j < numberOfCols - 1; j++) {
      // if we find an "A"
      if (rows[i][j] === "A") {
        // check if it is the center of 2 "MAS" words crossing in an X shape
        // if up-left is an "M" and down-right is an "S" OR if up-left is an "S" and down-right is an "M"
        // AND
        // if up-right is an "M" and down-left is an "S" OR if up-right is an "S" and down-left is an "M"
        // count ++

        if (
          (
            (rows[i - 1][j - 1] === "M" && rows[i + 1][j + 1] === "S") ||
            (rows[i - 1][j - 1] === "S" && rows[i + 1][j + 1] === "M")
          ) &&
          (
            (rows[i - 1][j + 1] === "M" && rows[i + 1][j - 1] === "S") ||
            (rows[i - 1][j + 1] === "S" && rows[i + 1][j - 1] === "M")
          )
        ) {
          count++;
        }
      }
    }
  }

  return count;
}

console.log(countXmas(rows));
console.log(countMasInXShape(rows));
