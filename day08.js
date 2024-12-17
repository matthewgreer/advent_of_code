/*
input is a string represesenting a map. rows of the map grid are separated by \n and columns have no space between them. a "." indicates an empty space, while a single uppercase or lowercase letter or numerical digit indicates an "antenna" with the unique "frequency" of that letter or digit. two antennas of the same "frequency" create "antinodes".

for part 1, "antinodes" occur at points that are in line with the two "antennas" of the same "frequency" and are twice as far away from one antenna as from the other. thus two like "antennas" create two "antinodes", while a third adds four more. "antinodes" may occur where other "antennas" are located, but "antinodes" that are out of the bounds of the map are not counted.

for part 2, "antinodes" occur at any point in the grid that is exactly in line with at least two "antennas". this includes the locations of the "antennas" themselves.

output is the number of unique locations within the bounds of the map that are "antinodes".

*/

import getInput from './shared/getInput.js';
const input = await getInput(8);

const antennaMap = input.trim().split('\n').map(row => row.split(''));
const rows = antennaMap.length;
const cols = antennaMap[0].length;
const antinodesOne = new Set();
const antinodesTwo = new Set();

const mapAntennas = () => {
  const locations = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const frequency = antennaMap[i][j];
      if (frequency === '.') continue;
      if (!locations[frequency]) {
        locations[frequency] = [];
      }
      locations[frequency].push([i, j]);
    }
  }

  return locations;
};

const antennaLocations = mapAntennas();

const findAntinodesPartOne = (ant1x, ant1y, ant2x, ant2y) => {
  const dx = ant2x - ant1x;
  const dy = ant2y - ant1y;
  const x1 = ant1x - dx;
  const y1 = ant1y - dy;
  const x2 = ant2x + dx;
  const y2 = ant2y + dy;
  if (x1 >= 0 && x1 < rows && y1 >= 0 && y1 < cols) antinodesOne.add(`${x1},${y1}`);
  if (x2 >= 0 && x2 < rows && y2 >= 0 && y2 < cols) antinodesOne.add(`${x2},${y2}`);
};

const findAntinodesPartTwo = (ant1x, ant1y, ant2x, ant2y) => {
  const dx = ant2x - ant1x;
  const dy = ant2y - ant1y;
  let x = ant1x;
  let y = ant1y;
  while (x >= 0 && x < rows && y >= 0 && y < cols) {
    antinodesTwo.add(`${x},${y}`);
    x += dx;
    y += dy;
  }

  x = ant2x;
  y = ant2y;

  while (x >= 0 && x < rows && y >= 0 && y < cols) {
    antinodesTwo.add(`${x},${y}`);
    x -= dx;
    y -= dy;
  }
}

const findAntinodesForAntenna = (frequency) => {
  const locations = antennaLocations[frequency];
  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      findAntinodesPartOne(locations[i][0], locations[i][1], locations[j][0], locations[j][1]);
      findAntinodesPartTwo(locations[i][0], locations[i][1], locations[j][0], locations[j][1]);
    }
  }
};

const findAntinodes = () => {
  for (const antenna in antennaLocations) {
    findAntinodesForAntenna(antenna);
  }

  return {
    partOne: antinodesOne.size,
    partTwo: antinodesTwo.size
  };
};

console.log(findAntinodes());
