/*  input: a string listing the delta amount a single press of "button a" and "button b" move a point across a grid, and the coordinates on that grid where the "prize" destination lies. after determining which, if any, combinations of button presses might reach the "prize", one should determine the lowest cost in "tokens" to reach the "prize", given that pressing "button a" costs 3 token, whereas "button b" costs 1 token.

    output: the least amount of "tokens" that can be spent to win all possible "prizes"

    example:
      "Button A: X+94, Y+34\nButton B: X+22, Y+67\nPrize: X=8400, Y=5400\n\nButton A: X+26, Y+66\nButton B: X+67, Y+21\nPrize: X=12748, Y=12176\n\nButton A: X+17, Y+86\nButton B: X+84, Y+37\nPrize: X=7870, Y=6450\n\nButton A: X+69, Y+23\nButton B: X+27, Y+71\nPrize: X=18641, Y=10279"

    parse to:
      [
        {
          buttonA: [94, 34],
          buttonB: [22, 67],
          prize: [8400, 5400]
        },
        {
          buttonA: [26, 66],
          buttonB: [67, 21],
          prize: [12748, 12176]
        },
        {
          buttonA: [17, 86],
          buttonB: [84, 37],
          prize: [7870, 6450]
        },
        {
          buttonA: [69, 23],
          buttonB: [27, 71],
          prize: [18641, 10279]
        },
      ]

    equation for finding combinations of buttonA and buttonB presses that navigate to the prize?
    if A is the # of presses of button A and B is the # of presses of button B
      (A * 94) + (B * 22) = 8400
      (A * 34) + (B * 67) = 5400

      could press B button no more than 80 times, which gets you to [1760, 5360]. beyond that you've overshot along the Y axis
      could press A button no more than 89 times, which gets you to [8366, 3026]. beyond that you've overshot along the X axis

      the 2 last coordinates you could get to the prize from are:
                                [8306, 5366]                                             [8378, 5333]
      the 4 penultimate coordinates you could get to the prize from are:
                             /                 \                                        /            \
                            /                   \                                      /              \
                      [94, 34]                [22, 67]                            [94, 34]           [22, 67]
                [8212, 5332]                  [8284, 5269]                 [8284, 5299]               [8356, 5266]
      the 8 antepenultimate coordinates
                /         \                   /           \                /          \                /           \
               /           \                 /             \              /            \              /             \
          [94, 34]       [22, 67]        [94, 34]        [22, 67]      [94, 34]        [22, 67]      [94, 34]        [22, 67]
      [8118, 5298]     [8190, 5265]  [8190, 5235]     [8272, 5202]  [8190, 5265]     [8262, 5232]  [8262, 5232]     [8334, 5199]

*/

import getInput from './shared/getInput.js';
const input = await getInput(13);

const parseInput= (input) => {
  const clawMachines = input.trim().split('\n\n');
  const result = clawMachines.map(clawMachine => {
    const lines = clawMachine.split('\n');
    const buttonA = lines[0].match(/Button A: X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
    const buttonB = lines[1].match(/Button B: X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
    const prize = lines[2].match(/Prize: X=(\d+), Y=(\d+)/).slice(1, 3).map(Number);
    return { buttonA, buttonB, prize };
  });
  return result;
};

class Coord {
  constructor(x, y, aPresses = 0, bPresses = 0) {
    this.x = x,
    this.y = y;
    this.aPresses = aPresses;
    this.bPresses = bPresses;
  }

  get key() {
    return `[${this.x}, ${this.y}]`
  }
}

const validPresses = (clawMachine) => {
  const { buttonA, buttonB, prize } = clawMachine;
  const valids = [];
  const queue = [new Coord(0, 0, 0, 0)];
  const visited = new Set();
  const [pX, pY] = prize,
        [aX, aY] = buttonA,
        [bX, bY] = buttonB;

  while (queue.length > 0) {
    // console.log(queue.length);
    const currentCoord = queue.shift();

    if (visited.has(currentCoord.key)) {
      // console.log("ALREADY VISITED!")
      continue;
    }

    if (currentCoord.x === pX && currentCoord.y === pY) {
      // console.log("MATCH!", currentCoord.x, pX, currentCoord.y);
      valids.push(currentCoord)
    };

    visited.add(currentCoord.key);

    const newAX = currentCoord.x + aX,
          newAY = currentCoord.y + aY,
          newBX = currentCoord.x + bX,
          newBY = currentCoord.y + bY;

    // console.log([[newAX, newAY], [newBX, newBY]]);

    if (newAX <= pX && newAY <= pY) {
      queue.push(new Coord(newAX, newAY, currentCoord.aPresses + 1, currentCoord.bPresses));
    }

    if (newBX <= pX && newBY <= pY) {
      queue.push(new Coord(newBX, newBY, currentCoord.aPresses, currentCoord.bPresses + 1));
    }
  }

  return valids;
};

const tokenTotal = (inputString) => {
  let total = 0;

  const clawMachines = parseInput(inputString);

  for (const cm of clawMachines) {
    const valids = validPresses(cm);

    if (valids.length > 1) {
      throw new Error("Yoips. Now there are two of them.", valids);
    }

    for (const coord of valids) {
      total += (coord.aPresses * 3) + coord.bPresses;
    }
  }

  return total;
}

// const inputString = "Button A: X+94, Y+34\nButton B: X+22, Y+67\nPrize: X=8400, Y=5400\n\nButton A: X+26, Y+66\nButton B: X+67, Y+21\nPrize: X=12748, Y=12176\n\nButton A: X+17, Y+86\nButton B: X+84, Y+37\nPrize: X=7870, Y=6450\n\nButton A: X+69, Y+23\nButton B: X+27, Y+71\nPrize: X=18641, Y=10279";

const inputString = input;

console.log(tokenTotal(inputString));
