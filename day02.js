/* input consists of many "reports", one "report" per line. each "report" is a list of numbers called "levels" that are separated by spaces. a "report" only counts as "safe" if both of the following are true:
  - the "levels" are either all increasing or all decreasing.
  - any two adjacent "levels" differ by at least one and at most three.

  the function returns:
    1. the number of "safe" "reports" in the input.
    2. the number of "safe" "reports" in the input, with tolerance for a single bad level in a report (i.e. if removing a single level from an unsafe report would make it safe, the report instead counts as safe)
*/

import getInput from "./shared/getInput.js";

const input = await getInput(2);
const reports = input.split("\n");
let safeCount = 0;
let safeCountWithTolerance = 0;

const checkReport = (levels, ascending) => {
  for (let i = 0; i < levels.length - 1; i++) {
    const diff = ascending ? levels[i + 1] - levels[i] : levels[i] - levels[i + 1];
    if (diff < 1 || diff > 3) return false;
  }

  return true;
}

const isSafe = (levels) => {
  let ascending;

  if (levels[0] < levels[1]) {
    ascending = true;
  } else if (levels[0] > levels[1]) {
    ascending = false;
  } else return false;

  return checkReport(levels, ascending);
};

for (const report of reports) {
  const levels = report.split(" ").map(el => parseInt(el));
  if (isSafe(levels)) safeCount++;
}

console.log(safeCount);
