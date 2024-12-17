/* input is a looooong single-line string of numbers. these numbers represent a "drive" full of "files". "files" are notated in the string thusly:
  - digits alternate in what they designate. first is a file's size, followed by the size of free space between that file and the next. eg. "12345" indicates a one-block file, two block of free space, a three-block file, four blocks of free space, and a five-block file.
  - files have an id based on their original position in the string. the first file is id 0, the second is id 1, etc. so the string "12345" has three files with ids 0, 1, and 2. "0..111....22222"

the "drive" needs to be "compacted"

PART 1: compact by moving file blocks one at a time from the end of the "drive" to the foremost free space block, until there are no more gaps remaining between file blocks. the process of compacting the example string "2333133121414131402" would look like this:
00...111...2...333.44.5555.6666.777.888899
009..111...2...333.44.5555.6666.777.88889.
0099.111...2...333.44.5555.6666.777.8888..
00998111...2...333.44.5555.6666.777.888...
009981118..2...333.44.5555.6666.777.88....
0099811188.2...333.44.5555.6666.777.8.....
009981118882...333.44.5555.6666.777.......
0099811188827..333.44.5555.6666.77........
00998111888277.333.44.5555.6666.7.........
009981118882777333.44.5555.6666...........
009981118882777333644.5555.666............
00998111888277733364465555.66.............
0099811188827773336446555566..............

PART 2: compact by moving whole files, starting from the highest id number, to the foremost free space block that can fit the file. if a large enough free space block doesn't exist to the left of the file, it does not move.

the final part of the compacting process is to calculate the "checksum" of the "drive". the checksum is calculated by adding up the result of multiplying each of these block's position (index) with the file ID number it contains. so the checksum of the above example would be:
  0 * 0 = 0  (0)     7 * 1 = 7   (95)   14 * 7 = 98   (606)   21 * 6 = 126 (1140)
  1 * 0 = 0  (0)     8 * 8 = 64 (159)   15 * 3 = 45   (651)   22 * 5 = 110 (1250)
  2 * 9 = 18 (18)    9 * 8 = 72 (231)   16 * 3 = 48   (699)   23 * 5 = 115 (1365)
  3 * 9 = 27 (45)   10 * 8 = 80 (311)   17 * 3 = 51   (750)   24 * 5 = 120 (1485)
  4 * 8 = 32 (77)   11 * 2 = 22 (333)   18 * 6 = 108  (858)   25 * 5 = 125 (1610)
  5 * 1 = 5  (82)   12 * 7 = 84 (417)   19 * 4 = 76   (934)   26 * 6 = 156 (1766)
  6 * 1 = 6  (88)   13 * 7 = 91 (508)   20 * 4 = 80  (1014)   27 * 6 = 162 (1928)

Checksum: 1928

output: the resulting checksum of the input string after it has been compacted
*/


import getInput from './shared/getInput.js';
const input = await getInput(9);

const makeDriveMap = (inputString) => {
  const map = [];
  let id = 0;

  for (let i = 0; i < inputString.length; i += 2) {
    let size = parseInt(inputString[i]);

    for (let j = 0; j < size; j++) map.push(id.toString());

    id++;

    if (inputString[i + 1] !== undefined) {
      let free = parseInt(inputString[i + 1]);

      for (let k = 0; k < free; k++) map.push(".");
    }
  }

  return map;
};

const compactDrive = (inputString) => {
  const driveMap = makeDriveMap(inputString);
  let nextAvailSpace = driveMap.indexOf(".");
  let movingBlockIdx = driveMap.length - 1;

  while (nextAvailSpace < movingBlockIdx) {
    let movingBlock = (driveMap[movingBlockIdx]);
    if (movingBlock !== ".") {
      driveMap[nextAvailSpace] = movingBlock;
      driveMap[movingBlockIdx] = ".";
    }
    movingBlockIdx--;
    nextAvailSpace = driveMap.indexOf(".", nextAvailSpace);
  }

  return driveMap.slice(0, nextAvailSpace);
};

const lastFileId = (driveMap) => {
  let i = driveMap.length - 1;
  while (driveMap[i] === '.' && i >= 0) i--;

  return driveMap[i];
};

const nextOpenSpaceIndex = (driveMap, start = 0) => {
  let spaceIndex = start;
  let length = driveMap.length;
  while (spaceIndex < length && driveMap[spaceIndex] !== '.') {
    spaceIndex++;
    if (spaceIndex === length) return -1;
  }

  return spaceIndex;
};

const largeEnoughSpace = (driveMap, searchStart, fileStart, fileSize) => {
  let start = searchStart;
  let currentSize = 0;
  let pointer = start;

  while (pointer < fileStart) {
    if (driveMap[pointer] === '.') {
      currentSize++;

      if (currentSize === fileSize) return start;

      pointer++;
    } else {
      currentSize = 0;
      start = nextOpenSpaceIndex(driveMap, pointer + 1);
      pointer = start;
    }
  }

  return -1;
};

const moveFileToSpace = (driveMap, fileId, fileStart, fileSize, spaceIndex) => {
  for (let i = 0; i < fileSize; i++) {
    // for safety; shouldn't ever happen
    if (fileStart + i >= driveMap.length || spaceIndex + i >= driveMap.length) return false;

    driveMap[spaceIndex + i] = fileId.toString();
    driveMap[fileStart + i] = '.';
  }

  return true;
};

const trimTrailingEmptySpace = (driveMap) => {
  let i = driveMap.length - 1;
  while (driveMap[i] === '.') i--;

  return driveMap.slice(0, i+1);
}

const compactDriveByFile = (inputString) => {
  const driveMap = makeDriveMap(inputString);
  let firstOpenSpace = nextOpenSpaceIndex(driveMap, 0);
  let fileId = lastFileId(driveMap);
  let fileSizePointer = inputString.length - 1;

  while (fileId >= 0) {
    let fileStart = driveMap.indexOf(fileId.toString());
    let fileSize = parseInt(inputString[fileSizePointer]);
    let spaceIndex = largeEnoughSpace(driveMap, firstOpenSpace, fileStart, fileSize);

    if (spaceIndex !== -1) {
      moveFileToSpace(driveMap, fileId, fileStart, fileSize, spaceIndex);
      if (driveMap[firstOpenSpace] !== '.') {
        firstOpenSpace = nextOpenSpaceIndex(driveMap, firstOpenSpace);
      }
    }

    fileSizePointer -= 2;
    fileId--;
  }

  return driveMap;
}

const calculateChecksum = (compactedDrive) => {
  return compactedDrive.reduce((acc, block, idx) => {
    if (block === '.') return acc;

    let id = parseInt(block);
    return acc + (id * idx);
  }, 0);
};

const inputString = input.trim();

const compactedDriveOne = compactDrive(inputString);
const checksumOne = calculateChecksum(compactedDriveOne);
console.log(checksumOne); // 6398252054886

const compactedDriveTwo = compactDriveByFile(inputString);
const checksumTwo = calculateChecksum(compactedDriveTwo);
console.log(checksumTwo); // 6415666220005
