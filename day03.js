/* input is a large string of "corrupted" data, within which are some "mul" (multiplication) operation instructions. valid instructions are mul(X,Y), where X and Y are each 1-3 digit numbers. invalid characters invalidate a "mul" instruction. for example:
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
  contains only four real "mul" instructions: mul(2,4), mul(5,5), mul(11,8), and mul(8,5). the sum of the products of these instructions is 2*4 + 5*5 + 11*8 + 8*5 = 8 + 25 + 88 + 40 = 161.

  in part 2, we will be asked to abide by "do" and "don't" instructions which enable or disable following the "mul" instructions.


  the function returns:
    1. the sum of the products of the valid "mul" instructions in the input.
    2. the sum of the products of valid "mul" instructions when enabled by the "do" instruction.
*/

import getInput from "./shared/getInput.js";

const input = await getInput(3);
const lastIdx = input.length - 1;
const DIGITS = "0123456789"

const checkM = (i) => {
  if (input[i + 1] === "u" &&
    input[i + 2] === "l" &&
    input[i + 3] === "("
  ) {
    let j = i + 4,
        numStr1 = "",
        numStr2 = "";

    if (!DIGITS.includes(input[j])) return false;

    let k = j;
    while (DIGITS.includes(input[k]) &&
      k - j < 3 &&
      k < lastIdx
    ) {
      numStr1 += input[k];
      k++;
    };

    j = k;
    if (input[j] !== ",") return false;

    j++;

    if (!DIGITS.includes(input[j])) return false;

    k = j;
    while (DIGITS.includes(input[k]) &&
      k - j < 3 &&
      k < lastIdx)
    {
      numStr2 += input[k];
      k++;
    }

    if (input[k] !== ")") return false;

    return [parseInt(numStr1), parseInt(numStr2), k];
  } else {
    return false;
  }
}

const addValidMuls = (input, useConditions = false) => {
  let i = 0,
      sum = 0,
      enabled = true;

  while (i <= lastIdx - 8) {  // the minimum length of a valid mul "mul(x,y)"
    if (useConditions) {
      if (input.substring(i, i + 4) === "do()") enabled = true;
      if (input.substring(i, i + 7) === "don't()") enabled = false;
    }

    if (enabled && input[i] === "m") {
      let validFactors = checkM(i);
      if (validFactors) {
        const [a, b, newIdx] = validFactors;
        sum += (a * b);
        i = newIdx;
      }
    }
    i++;
  }

  return sum;
};

console.log({
  "validMuls": addValidMuls(input, false),
  "validMulsWithConditions": addValidMuls(input, true)
});
