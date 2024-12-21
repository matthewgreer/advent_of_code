/*  input is a string of capital letters arranged in a grid. rows are separated by newlines. columns have no separation.

  the grid is a map of a "farm" where each cell is a "plot" of land, growing a "crop" of a certain type -- represented by the letter in the cell. where multiple "plots" of the same "crop" are adjacent (vertically or horizontally), they form a "region". the "area" of a region is the number of "plots" it contains. the "perimeter" of a region is the number of "plots" on the edge of the region. the number of "sides" a region has considers a line of adjacent plots as a single side rather than counting each plot.

  the "price" of fencing a "region" is:
    part 1: the "area" of the "region" multiplied by its "perimeter".
    part 2: the "area" of a "region" multiplied by its number of "sides"

  example:

    RRRRIICCFF
    RRRRIICCCF
    VVRRRCCFFF
    VVRCCCJFFF
    VVVVCJJCFE
    VVIVCCJJEE
    VVIIICJJEE
    MIIIIIJJEE
    MIIISIJEEE
    MMMISSJEEE

  It contains:
    A region of R plants with price 12 * 18 = 216.
    A region of I plants with price 4 * 8 = 32.
    A region of C plants with price 14 * 28 = 392.
    A region of F plants with price 10 * 18 = 180.
    A region of V plants with price 13 * 20 = 260.
    A region of J plants with price 11 * 20 = 220.
    A region of C plants with price 1 * 4 = 4.
    A region of E plants with price 13 * 18 = 234.
    A region of I plants with price 14 * 22 = 308.
    A region of M plants with price 5 * 12 = 60.
    A region of S plants with price 3 * 8 = 24.

  So, it has a total price of 1930.

  output: the total price of fencing all "regions" on the "farm"
*/

import getInput from './shared/getInput.js';

const input = await getInput(12);

const farm = (inputString) => {
  return inputString.trim().split('\n').map(row => row.split(''));
};

class Plot {
  constructor(farm, row, col, crop) {
    this.map = farm,
      this.row = row,
      this.col = col,
      this.crop = crop,
      this.borders = this.checkBorders(),
      this.perimeter = this.calcPerimeter();
  }

  checkBorders() {
    // returns whether the plots to the West, North, East, and South are different crops (or edges of the map)
    let borders = {
      "west": this.col > 0 ? this.map[this.row][this.col - 1] !== this.crop : true,
      "north": this.row > 0 ? this.map[this.row - 1][this.col] !== this.crop : true,
      "east": this.col < this.map[0].length - 1 ? this.map[this.row][this.col + 1] !== this.crop : true,
      "south": this.row < this.map.length - 1 ? this.map[this.row + 1][this.col] !== this.crop : true
    }

    return borders;
  }

  calcPerimeter() {
    let perimeter = 0;
    let borders = this.borders;
    Object.values(borders).forEach(border => {
      if (border) perimeter++;;
    });
    return perimeter;
  }
}

class Region {
  constructor(id) {
    this.id = id,
    this.plots = [],
    this.borders = {
      "west": {},
      "north": {},
      "east": {},
      "south": {}
    }
  }

  addPlot(plot) {
    this.plots.push(plot);
    this.sortPlotBorders(plot);
  }

  getPlot(row, col) {
    const plot = this.plots.find(plot => plot.row === row && plot.col === col);
    return plot;
  }

  sortPlotBorders(plot) {
    for (const [direction, hasBorder] of Object.entries(plot.borders)) {
      if (hasBorder) this.addToBorderList(direction, plot.row, plot.col);
    }
  }

  addToBorderList(dir, row, col) {
    if (dir === "west" || dir === "east") {
      if (this.borders[dir][col] === undefined) this.borders[dir][col] = [];
      this.borders[dir][col].push(row);
    } else {
      if (this.borders[dir][row] === undefined) this.borders[dir][row] = [];
      this.borders[dir][row].push(col);
    }
  }

  get area() {
    return this.plots.length;
  }

  get perimeter() {
    return this.plots.reduce((total, plot) => total += plot.perimeter, 0);
  }

  countSides() {
    // count the borders of each of the plots of the region, then filter out the continuous ones
    /*
    this.borders = {
      "west": {
        "0": [1, 2, 6]    <--  key: col, val: [row, row, row]
      },
      "north": {
        "4": [3, 4, 5, 7] <--  key: row, val: [col, col, col]
      },
      etc...
    }
    */

    const calculateSidesFromBorderList = (list) => {
      list.sort((a, b) => a - b);
      const processedList = [];

      while (true) {
        const currentBorder = list.shift();
        if (currentBorder === undefined) break;

        const previousBorder = processedList.at(-1);

        if (previousBorder === undefined) {
          processedList.push(currentBorder);
          continue;
        }

        if (currentBorder - previousBorder === 1) {
          processedList.pop(); // removing continuous side segment
        }

        processedList.push(currentBorder);
      }

      return processedList.length;
    }

    let sides = 0;

    for (const borders of Object.values(this.borders)) {
      for (const list of Object.values(borders)) {
        sides += calculateSidesFromBorderList(list);
      }
    }

    return sides;
  }
}

class Crop {
  constructor(symbol) {
    this.symbol = symbol,
      this.nextRegionId = 0;
    this.regions = []
  }

  addRegion() {
    const newRegion = new Region(this.nextRegionId);
    this.regions.push(newRegion);
    this.nextRegionId++;
    return newRegion;
  }

  deleteRegion(id) {
    this.regions = this.regions.filter(r => r.id !== id);
  }

  getRegionById(id) {
    const region = this.regions.find(r => r.id === parseInt(id, 10));
    return region;
  }
}

class Farm {
  constructor(array) {
    this.map = array,
    this.rows = array.length;
    this.columns = array[0].length;
    this.crops = [],
      this.coordTable = new Map();
  }

  getCrop(symbol) {
    // console.log("finding crop", symbol);
    const crop = this.crops.find(c => c.symbol === symbol);
    // console.log(crop);
    return crop;
  }

  addCrop(symbol) {
    this.crops.push(new Crop(symbol));
  }

  saveCoordRegion(row, col, cropSymbol, regionId) {
    this.coordTable.set(`${row},${col}`, `${cropSymbol},${regionId}`)
  }

  getCropRegKey(row, col) {
    return this.coordTable.get(`${row},${col}`);
  }

  getCoordCrop(row, col) {
    const cropRegKey = this.getCropRegKey(row, col);
    const [cropSymbol, _regionId] = cropRegKey.split(',');
    return this.getCrop(cropSymbol);
  }

  getCoordRegion(row, col) {
    const cropRegKey = this.getCropRegKey(row, col);
    const [cropSymbol, regionId] = cropRegKey.split(',');
    const crop = this.getCrop(cropSymbol);
    const region = crop.getRegionById(regionId);
    return region;
  }

  getCoordPlot(row, col) {
    const region = this.getCoordRegion(row, col);
    return region.getPlot(row, col);
  }

  chooseRegionForPlot(plot) {
    let north, northReg, west, westReg, region;

    if (plot.row > 0) {
      north = this.getCoordPlot(plot.row - 1, plot.col);
      northReg = this.getCoordRegion(north.row, north.col);
    }
    if (plot.col > 0) {
      west = this.getCoordPlot(plot.row, plot.col - 1);
      westReg = this.getCoordRegion(west.row, west.col);
    }

    if (north &&
      north.crop === plot.crop &&
      west &&
      west.crop === plot.crop &&
      northReg !== westReg) {
      region = this.mergeRegions(plot.crop, northReg, westReg);
    } else if (north && north.crop === plot.crop) {
      region = northReg;
    } else if (west && west.crop === plot.crop) {
      region = westReg;
    } else {
      const crop = this.getCrop(plot.crop);
      region = crop.addRegion()
    }

    return region;
  }

  mergeRegions(cropSymbol, reg1, reg2) {
    // determine which of the ids is the lesser
    const keepReg1 = parseInt(reg1.id, 10) < parseInt(reg2.id, 10);
    const mergeToRegion = keepReg1 ? reg1 : reg2;
    const mergeFromRegion = keepReg1 ? reg2 : reg1;

    for (const plotToMerge of mergeFromRegion.plots) {
      mergeToRegion.addPlot(plotToMerge);
      this.saveCoordRegion(plotToMerge.row, plotToMerge.col, cropSymbol, mergeToRegion.id);
    }

    this.getCrop(cropSymbol).deleteRegion(mergeFromRegion.id);

    return mergeToRegion;
  }

  plotMap() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const cropSymbol = this.map[row][col];
        const plot = new Plot(this.map, row, col, cropSymbol);

        if (this.getCrop(cropSymbol) === undefined) {
          this.addCrop(cropSymbol);
        }
        const crop = this.getCrop(cropSymbol);
        const region = crop.regions.length === 0 ? crop.addRegion() : this.chooseRegionForPlot(plot);
        region.addPlot(plot);
        this.saveCoordRegion(row, col, cropSymbol, region.id);
      }
    }
  }

  calculateFencingPriceByPerimeter() {
    const price = this.crops.reduce((farmTotal, crop) => {
      return farmTotal += crop.regions.reduce((cropTotal, region) => {
        return cropTotal += region.area * region.perimeter;
      }, 0);
    }, 0);

    return price;
  }

  calculateFencingPriceBySides() {
    const price = this.crops.reduce((farmTotal, crop) => {
      return farmTotal += crop.regions.reduce((cropTotal, region) => {
        return cropTotal += region.area * region.countSides();
      }, 0);
    }, 0);

    return price;
  }
}


// const inputString = "AAAA\nBBCD\nBBCC\nEEEC";
// const inputString = "AAAAAA\nAAABBA\nAAABBA\nABBAAA\nABBAAA\nAAAAAA"
// const inputString = "RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE\n";

const inputString = input;

const farmArray = farm(inputString);
const myStupidFarm = new Farm(farmArray);

myStupidFarm.plotMap();

console.log(myStupidFarm.calculateFencingPriceByPerimeter());   // 1319878
console.log(myStupidFarm.calculateFencingPriceBySides());       // 784982
