/* input consists of many "reports", one "report" per line. each "report" is a list of numbers called "levels" that are separated by spaces. a "report" only counts as "safe" if both of the following are true:
  - the "levels" are either all increasing or all decreasing.
  - any two adjacent "levels" differ by at least one and at most three.

  the function returns:
    1. the number of "safe" "reports" in the input.
    2.

*/

import getInput from "./shared/getInput.js";

const reports = await getInput(2);
let safeCount = 0;

const checkAscReport = (levels) => {
  for (let i = 0; i < levels.length - 1; i++) {
    const diff = levels[i + 1] - levels[i];
    if (diff < 1 || diff > 3) return false;
  }

  return true;
};

const checkDescReport = (levels) => {
  for (let i = 0; i < levels.length - 1; i++) {
    const diff = levels[i] - levels[i + 1];
    if (diff < 1 || diff > 3) return false;
  }

  return true;
};

const isSafe = (report) => {
  const levels = report.split(" ").map(el => parseInt(el));

  if (levels[0] < levels[1]) {
    return checkAscReport(levels);
  } else if (levels[0] > levels[1]) {
    return checkDescReport(levels);
  } else return false;
};

for (const report of reports.split("\n")) {
  if (isSafe(report)) safeCount++;
}

console.log(safeCount);
