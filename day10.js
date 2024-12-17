/* input: a string of numbers, rows separated by \n new lines, denoting a grid "topographical map".

the digits on the map, 0-9, indicate elevations. 0s are "trailheads" and 9s are "peaks". a valid hiking trail is one that can go from 0 to 9, increasing by only 1 each step. steps on the grid can be taken up, down, right, or left, but cannot be taken diagonally.

for example:
  89010123
  78121874
  87430965
  96549874
  45678903
  32019012
  01329801
  10456732

  the 9 "trailheads" in the example "map" are located at these coordinates, followed by their "score" -- the number of "peaks" they can reach:
  [0,2]: 5
  [0,4]: 6
  [2,4]: 5
  [4,6]: 3
  [5,2]: 1
  [5,5]: 3
  [6,0]: 5
  [6,6]: 3
  [7,1]: 5
  [0,2]: 5

  here are the 9 "trailheads" from the example "map", but this time they are followed by their "rating" -- the number of distinct "trails" to "peaks" from each "trailhead".
  [0,4]: 6
  [2,4]: 5
  [4,6]: 3
  [5,2]: 1
  [5,5]: 3
  [6,0]: 5
  [6,6]: 3
  [7,1]: 5



  output:
  PART ONE: the sum total of the "scores" of all "trailheads" on the "map"
  PART TWO: the sum total of the "ratings" of all "trailheads" on the "map"
*/

import getInput from './shared/getInput.js';

const VECTORS = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const input = await getInput(10);

const formatMap = (inputString) => {
  return inputString.trim().split('\n').map((row, rIdx) => row.split('').map((elev, cIdx) => {
    let e = parseInt(elev);
    let coord = [rIdx, cIdx];

    if (e === 0) trailheads.push(coord);

    return e;
  }));
};

const key = (row, column) => {
  return row.toString() + ',' + column.toString();
};

const elevation = (map, row, column) => {
  return map[row][column];
};

const validStepsUp = (map, row, col) => {
  const elev = elevation(map, row, col),
        stepsUp = [];

  for (const [vr, vc] of VECTORS) {
    const stepRow = row + vr;
    const stepCol = col + vc;
    if (stepRow >= 0 &&
      stepRow < map.length &&
      stepCol >= 0 &&
      stepCol < map[0].length &&
      map[stepRow][stepCol] === elev + 1
    ) stepsUp.push([stepRow, stepCol]);
  }

  return stepsUp;
};

const validPeaks = (map, row, col, peaks = new Set()) => {
  const elev = elevation(map, row, col);
  const stepsUp = validStepsUp(map, row, col);

  for (let i = 0; i < stepsUp.length; i++) {
    const [stepR, stepC] = stepsUp[i];
    const stepElev = elevation(map, stepR, stepC);

    if (stepElev === 9) peaks.add(key(stepR, stepC));

    let otherPeaks = validPeaks(map, stepR, stepC, peaks);
    otherPeaks.forEach(p => peaks.add(p));
  }

  return peaks;
};

const scoreAllTrailheads = (trailheads, map) => {
  const scores = {};

  for (const th of trailheads) {
    const [thR, thC] = th;
    scores[th] = validPeaks(map, thR, thC).size;
  }

  return scores;
};

const totalMapScore = (inputString) => {
  const map = formatMap(inputString);
  const scores = scoreAllTrailheads(trailheads, map);
  const total = Object.values(scores).reduce((t, v) => t += v);

  return total;
};

const trailheads = [];
const inputString = input;
// const inputString = "89010123\n78121874\n87430965\n96549874\n45678903\n32019012\n01329801\n10456732" // test input

console.log(totalMapScore(inputString));
