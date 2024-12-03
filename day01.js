/* takes in a bunch of numbers representing two lists.

the compareLists function will return:
  1. a number representing the "difference" between the two lists. the "difference" is found by comparing the smallest number in the first list with the smallest number in the second list, and noting the difference between those two numbers. that difference is then added to the difference between the second-smallest numbers in each list, and so on.

  2. a number representing the "similarity" between the two lists. the "similarity" is found by checking whether a number in the second list appears in the first list, and if so, how many times. a number in the second list appearing in the first list n times will add n times that number to the "similarity" number.
*/

import getInput from "./shared/getInput.js";

const lists = await getInput(1);

const splitLists = () => {
  let list1 = [];
  let list2 = [];

  const split = lists.split("\n");

  split.map((pair) => {
    const [num1, num2] = pair.split("   ");
    const number1 = parseInt(num1);
    const number2 = parseInt(num2);

    if (typeof(number1) === "number") {
      list1.push(number1);
    }

    if (typeof(number2) === "number") {
      list2.push(number2);
    }

    return [list1, list2];
  });

  list1.sort((a, b) => a - b);
  list2.sort((a, b) => a - b);

  return [list1, list2];
};

const [list1, list2] = splitLists();

const compareLists = () => {
  let difference = 0;
  let similarity = 0;
  let set = new Set(list1);

  for (let i = 0; i < list1.length - 1; i++) {
    let el1 = list1[i];
    let el2 = list2[i];
    difference += Math.abs(el1 - el2);

    if (set.has(el2)) similarity += el2;
  }

  return { "difference": difference, "similarity": similarity };
};

console.log(compareLists(list1, list2));
