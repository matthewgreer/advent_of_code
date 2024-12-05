/* Oof this one is complicated. Input is two-fold.
    1. a string list of numbers separated by "|", representing page numbers in a manual. the first number page must be printed before the second number page.
    2. a string list of numbers separated by ",", representing "updates" to the manual, and the order in which page numbers will be printed

  Some of these updates will correctly follow the rules set out by the first list; some will be invalid based on those rules. Determining the output relies on:
    1. identifying which updates are valid (in the right order based on the rules)
    2. finding the "middle page number" of each valid order (ie the 3rd page in an order of 5 pages)
    3. adding up the middle page numbers of valid orders
    4. returning that sum.

*/

import getInput from "./shared/getInput.js";

const input = await getInput(5);
let [rs, uds] = input.split("\n\n");

rs = rs.split("\n").map(r => {
  let [x, y] = r.split("|");
  return [parseInt(x), parseInt(y)];
});

uds = uds.split("\n").map(u => {
  let update = u.split(",")
  return update.map(n => parseInt(n));
});

const uLength = uds.length,
      rules = rs.slice(),
      updates = uds.slice(0, uLength - 1); // trim blank space at end

// create dictionary of pages that must come after pages
const pageRules = {};
rules.forEach(([p1, p2]) => {
  if (!pageRules[p1]) pageRules[p1] = new Set();
  pageRules[p1].add(p2);
});

const repairUpdate = (update) => {
  return update.sort((a, b) => {
    if (pageRules[a].has(b)) return -1;
    else if (pageRules[b].has(a)) return 1;
    else return 0;
  });
};

const midValue = (update) => {
  let mid = Math.floor(update.length / 2);

  return update[mid];
}

const sumOfValidMids = () => {
  let totalValidMids = 0,
      totalOfCorrectedMids = 0;

  for (const update of updates) {
    // start with last page of update, check whether any of the preceding pages are in its dictionary of pages it must come before.
    let valid = true,
      i = update.length - 1;

    while (valid && i > 0) {
      let j = i - 1;
      while (valid && j >= 0) {
        if (pageRules[update[i]].has(update[j])) valid = false;
        j--;
      }
      i--;
    }

    if (valid) {
      totalValidMids += midValue(update);
    } else {
      totalOfCorrectedMids += midValue(repairUpdate(update));
    }
  }

  return {
    "totalValidMids": totalValidMids,
    "totalWithCorrectedMids": totalOfCorrectedMids,
  };
}

console.log(sumOfValidMids());
