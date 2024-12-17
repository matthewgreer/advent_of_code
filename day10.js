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

class Node {
  constructor(map, row, column) {
    this.map = map;
    this.row = row;
    this.column = column;
    this.elevation = this.map[row][column];

    this.vectors = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    this.stepsUp = this.findValidStepsUp();
    this.peaks = this.accessiblePeaks();
    // this.trails = this.uniqueTrails();
  }

  inMapBounds(r, c) {
    return r >= 0 && r < this.map.length && c >= 0 && c < this.map[0].length;
  }

  findValidStepsUp() {
    const steps = [];
    for (const [vr, vc] of this.vectors) {
      const stepRow = this.row + vr;
      const stepCol = this.column + vc;
      if (this.inMapBounds(stepRow, stepCol) && this.map[stepRow][stepCol] === this.elevation + 1) {
        steps.push(new Node(this.map, stepRow, stepCol));
      }
    }

    return steps;
  }

  makeKey(r, c) {
    return r.toString() + ',' + c.toString();
  }

  accessiblePeaks() {
    const peaks = new Set();
    for (const step of this.stepsUp) {
      if (step.elevation === 9) peaks.add(this.makeKey(step.row, step.column));
      const stepPeaks = step.peaks;
      for (const peak of stepPeaks) peaks.add(peak);
    }

    return peaks;
  }

  uniqueTrails() {
    // will implement a DFS solution, maybe returns just the count, or maybe returns a collection of arrays of coordinates representing each unique path?


  }

  countPeaks() {
    return this.peaks.size;
  }

  countTrails() {
    return this.trails.size; // maybe?
  }
};

const mapTrailheads = (inputString) => {
  const thCoords = [];
  const map = inputString.trim().split('\n').map((row, rIdx) => row.split('').map((elev, cIdx) => {
    let e = parseInt(elev);
    let coord = [rIdx, cIdx];

    if (e === 0) thCoords.push(coord);

    return e;
  }));

  const trailheads = thCoords.map((coord) => {
    const [r, c] = coord;
    return new Node(map, r, c);
  })

  return trailheads;  // just return trailheads?
};

const scoreAllTrailheads = (trailheads) => {
  const scores = {};

  for (const th of trailheads) {
    scores[th.makeKey(th.row, th.column)] = th.countPeaks();
  }

  return scores;
};

const rateAllTrailheads = (trailheads) => {
  const ratings = {};

  for (const th of trailheads) {
    ratings[th.makeKey(th.row, th.column)] = th.countTrails();
  }

  return ratings;
};

const totalMapScore = (trailheads) => {
  const scores = scoreAllTrailheads(trailheads);
  const total = Object.values(scores).reduce((t, v) => t += v);

  return total;
};

const totalMapRating = (trailheads) => {
  const ratings = rateAllTrailheads(trailheads);
  const total = Object.values(ratings).reduce((t, v) => t += v);

  return total;
}

// const inputString = "89010123\n78121874\n87430965\n96549874\n45678903\n32019012\n01329801\n10456732" // test input
const inputString = input;
const trailheads = mapTrailheads(inputString);


console.log(totalMapScore(trailheads));  // test input: 36, full input: 514.
// console.log(totalMapRating(trailheads)); // test input: 81, full input: ???.
