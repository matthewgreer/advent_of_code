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

const checkReport = (levels) => {
  let diff;
  switch (reportDirection(levels[0], levels[1])) {
    case "unsafe":
      return false;
    case "asc":
      diff = function(a, b) { return b - a; }
      break;
    case "desc":
      diff = function(a, b) { return a - b; }
      break;
    default:
      return false;
  }

  for (let i = 0; i < levels.length - 1; i++) {
    let difference = diff(levels[i], levels[i + 1]);
    if (difference < 1 || difference > 3) {
      return false;
    }
  }

  return true;
};

const reportDirection = (zeroIdx, oneIdx) => {
  if (zeroIdx < oneIdx) {
    return "asc";
  } else if (zeroIdx > oneIdx) {
    return "desc";
  } else return "unsafe";
}

const isSafe = (levels, withTolerance) => {
  const safeReport = checkReport(levels);
  if (safeReport) {
    return true;
  } else if (withTolerance) {
    let i = 0;
    while (i < levels.length) {
      let subLevel = levels.slice(0, i).concat(levels.slice(i + 1));
      const safeSubReport = checkReport(subLevel);

      if (safeSubReport) {
        return true;
      } else {
        i++;
      }
    }
  }
  return false;
};

const countSafeReports = (reports) => {
  for (const report of reports) {
    const levels = report.split(" ").map(el => parseInt(el));
    if (!isNaN(levels[0])) {
      if (isSafe(levels, false)) safeCount++;
      if (isSafe(levels, true)) safeCountWithTolerance++;
    }
  }

  return {
    "safeCount": safeCount,
    "safeCountWithTolerance": safeCountWithTolerance
  };
};

console.log(countSafeReports(reports));
