/*
  input is a string of numbers separated by spaces. the numbers will be simultaneously changed by "blinking" (a step), according to the first applicable rule of the following:
    1. if the number is 0, it becomes 1.
    2. if the number has an even number of digits, it becomes two numbers thus: the left half of the digits and the right half of the digits, with leading zeroes dropped (ie 1000 becomes 10 and 0).
    3. if neither of these rules apply, the number becomes the product when multiplied by 2024.

  example:
    initial ( 2 #s):  125 17
    step 1  ( 3 #s):  253000 1 7
    step 2  ( 4 #s):  253 0 2024 14168
    step 3  ( 5 #s):  512072 1 20 24 28676032
    step 4  ( 9 #s):  512 72 2024 2 0 2 4 2867 6032
    step 5  (13 #s):  1036288 7 2 20 24 4048 1 4048 8096 28 67 60 32
    step 6  (22 #s):  2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2

  part 1: given the input, how many numbers will there be after 25 steps?
*/

import getInput from './shared/getInput.js';

const input = await getInput(11);

const initializeInput = (inputString) => {
  return inputString.trim().split(' ');     // keep numbers in string form.
};

const transformNumber = (numString) => {
  if (numString === '0') return ['1'];
  if (numString.length % 2 === 0) {
    let mid = Math.floor(numString.length / 2),
        left = numString.slice(0, mid),
        right = numString.slice(mid);

    return [parseInt(left).toString(), parseInt(right).toString()];
  }

  let numInt = parseInt(numString);
  let product = numInt * 2024;
  return [product.toString()];
};

const transformSequence = (array) => {
  const newArray = [];
  array.forEach(ns => {
    const newNum = transformNumber(ns);
    for (const n of newNum) {
      newArray.push(n)
    }
  })

  return newArray;
};

const performTransformations = (count, sequence) => {
  let current = sequence.slice();
  console.log("starting sequence:", current);
  for (let i = 1; i <= count; i++) {
    current = transformSequence(current);
    console.log("step", i, ":", current);
  }

  return current;
}

const inputString = input;
// const inputString = "125 17"; // test input

const array = initializeInput(inputString);
// console.log((performTransformations(6, array)).length);   // test input => 22,    full input => 73
console.log((performTransformations(25, array)).length);  // test input => 55312, full input => 190865
