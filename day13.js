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

    part 2 evilness: oops. the X & Y coordinates of the prize are off by 10,000,000,000,000 (ten trillion). so for the example above, the coordinates would be:
      [
        {
          buttonA: [94, 34],
          buttonB: [22, 67],
          prize: [10000000008400, 10000000005400]
        },
        {
          buttonA: [26, 66],
          buttonB: [67, 21],
          prize: [10000000012748, 10000000012176]
        },
        {
          buttonA: [17, 86],
          buttonB: [84, 37],
          prize: [10000000007870, 10000000006450]
        },
        {
          buttonA: [69, 23],
          buttonB: [27, 71],
          prize: [10000000018641, 10000000010279]
        },
      ]

*/

import getInput from './shared/getInput.js';
const input = await getInput(13);

const parseInput= (input, part = 1) => {
  const clawMachines = input.trim().split('\n\n').map(clawMachine => {
    const lines = clawMachine.split('\n');
    const buttonA = lines[0].match(/Button A: X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
    const buttonB = lines[1].match(/Button B: X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
    let prize = lines[2].match(/Prize: X=(\d+), Y=(\d+)/).slice(1, 3).map(Number);

    if (part === 2) {
      prize = prize.map(coord => coord + 10000000000000);
    }

    return { buttonA, buttonB, prize };
  });
  return clawMachines;
};

const getCramerCoefficients = (clawMachine) => {
  /* Cramer's Rule is a method for solving a system of linear equations. If you have two equations with two unknowns:
    1. (a_1x + b_1y = c_1)
    2. (a_2x + b_2y = c_2)
  you can use determinants to solve for x and y. A determinant is calculated from a matrix. For a 2x2 matrix:
    | a  b |
    | c  d |
  the determinant is calculated as: det = a * d - b * c.

  So for our equations, where
    A signifies the number of times buttonA is pressed
    B signifies the number of times buttonB is pressed
    [aX, aY] is the amount one press of buttonA shifts the X and Y coordindates
    [bX, bY] is the amount one press of buttonB shifts the X and Y coordindates
    [pX, pY] are the coordinates where the prize is located

    1. A * aX + B * bX = pX  AND
    2. A * aY + B * bY = pY

    our matrices:
    | aX  bX |      | pX  bX |      | aX  pX |
    | aY  bY |      | pY  bY |      | aY  pY |

    so  determinate D  = aX * bY - bX * aY
        determinate Da = pX * bY - bX * pY
        determinate Db = aX * pY - aY * pX

    and those coefficients for A and B are:
    A: Da / D,
    B: Db / D
  */
 
  const { buttonA, buttonB, prize } = clawMachine,
        [pX, pY] = prize,
        [aX, aY] = buttonA,
        [bX, bY] = buttonB,
        D = aX * bY - bX * aY;

  if (D === 0) return { a: 0, b: 0 }

  const Da = pX * bY - bX * pY,
        Db = aX * pY - pX * aY;

  return { a: Da / D, b: Db / D };
};

const countTokens = (clawMachine) => {
  const { a, b } = getCramerCoefficients(clawMachine);

  if ([a, b].some(coeffs => coeffs !== Math.trunc(coeffs))) return 0; // ignore results that have non-integer coefficients

  return a * 3 + b;
};

const totalTokens = (inputString, part) => {
  let total = 0;

  const clawMachines = parseInput(inputString, part);

  for (const cm of clawMachines) {
    total += countTokens(cm);
  }

  return total;
}

// const inputString = "Button A: X+94, Y+34\nButton B: X+22, Y+67\nPrize: X=8400, Y=5400\n\nButton A: X+26, Y+66\nButton B: X+67, Y+21\nPrize: X=12748, Y=12176\n\nButton A: X+17, Y+86\nButton B: X+84, Y+37\nPrize: X=7870, Y=6450\n\nButton A: X+69, Y+23\nButton B: X+27, Y+71\nPrize: X=18641, Y=10279";

const inputString = input;

console.log("Part 1: ", totalTokens(inputString, 1));
console.log("Part 2: ", totalTokens(inputString, 2));
