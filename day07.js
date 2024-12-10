/*
input is a string of "calibration equations", with one equation per line. the operators (+ and *) have been omitted, so each "equation" line has a value followed by a colon, then some number of numbers separated by spaces. For example:

190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20

the goal is to determine whether the remaining numbers in each equation line can be combined with operators to produce the test value given before the colon. NOTE: operators are evaluated left-to-right, not by order of operations. For example, the second line above has two possible positions for operators, and of the four possible combinations, two produce the correct result WHEN EVALUATED LEFT-TO-RIGHT: 81 + 40 * 27 = 3267 and 81 * 40 + 27 = 3267.

part two adds a third potential operator, a concatenator operator. evaluating left-to-right, still, numbers could either be added, multiplied, or concatenated.

for example, the first line above could be 10 + 19 = 29, 10 * 19 = 190, or 10 c 19 = 1019.

the last line 292: 11 6 16 20 above could be interpreted as:
11 + 6 = 17, [16, 20]
11 * 6 = 66, [16, 20]
11 c 6 = 116, [16, 20]

17 + 16 = 33, [20]
17 * 16 = 272, [20]
17 c 16 = 1716, [20]

33 + 20 = 53
33 * 20 = 660
33 c 20 = 3320

272 + 20 = 292 <-- this equals the test value, so this is a valid equation
272 * 20 = 5440
272 c 20 = 27220

1718 + 20 = 1738
1718 * 20 = 34360
1718 c 20 = 171820

the output is the total calibration result, the sum of the test values from just the equations that could possibly be correct with the potential operators.
  1. only + and * operators
  2. +, *, and c (concatenation) operators
*/

import getInput from './shared/getInput.js';

const input = await getInput(7);
const equations = input.trim().split('\n');
let total = 0;

const testEquation = (equation) => {
  let [value, nums] = equation.split(': ');
  value = parseInt(value);
  nums = nums.split(' ').map(num => parseInt(num));

  const testEquationHelper = (nums, acc, value) => {
    if (nums.length === 0) return acc === value;

    const [num, ...rest] = nums;
    const concattedNum = parseInt(acc.toString() + num.toString());

    return testEquationHelper(rest, acc + num, value) || testEquationHelper(rest, acc * num, value) || testEquationHelper(rest, concattedNum, value);
  };

  const valid = testEquationHelper(nums, 0, value);
  if (valid) total += value;
  return valid;
}

const totalCalibrationResult = (eqs) => {
  eqs.forEach(eq => testEquation(eq));
  return total;
}

console.log(totalCalibrationResult(equations)); //
