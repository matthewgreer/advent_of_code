/*  input is a string of capital letters arranged in a grid. rows are separated by newlines. columns have no separation.

  the grid is a map of a "farm" where each cell is a "plot" of land, growing a "crop" of a certain type -- represented by the letter in the cell. where multiple "plots" of the same "crop" are adjacent (vertically or horizontally), they form a "region". the "price" of fencing a "region" is:
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

// const inputString = "RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE\n";
const inputString = input;

const farmArray = farm(inputString);

class Plot {
  constructor(farm, row, col, crop) {
    this.map = farm,
    this.row = row,
    this.col = col,
    this.crop = crop
    this.perimeter = this.calcPerimeter();
  }

  calcPerimeter() {
    let perimeter = 0;
    if (this.row === 0 || this.map[this.row - 1][this.col] !== this.crop) perimeter++;
    if (this.row === this.map.length - 1 || this.map[this.row + 1][this.col] !== this.crop) perimeter++;
    if (this.col === 0 || this.map[this.row][this.col - 1] !== this.crop) perimeter++;
    if (this.col === this.map[0].length - 1 || this.map[this.row][this.col + 1] !== this.crop) perimeter++;

    return perimeter;
  }
}

class Region {
  constructor(id) {
    this.id = id,
    this.plots = []
  }

  addPlot(plot) {
    this.plots.push(plot);
  }

  getPlot(row, col) {
    const plot = this.plots.find(plot => plot.row === row && plot.col === col);
    if (!plot) console.log("can't find it in", this.plots);
    return plot;
  }

  get area() {
    return this.plots.length;
  }

  get perimeter() {
    return this.plots.reduce((total, plot) => total += plot.perimeter, 0);
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
    let up, upReg, left, leftReg, region;

    if (plot.row > 0) {
      up = this.getCoordPlot(plot.row - 1, plot.col);
      upReg = this.getCoordRegion(up.row, up.col);
    }
    if (plot.col > 0) {
      left = this.getCoordPlot(plot.row, plot.col - 1);
      leftReg = this.getCoordRegion(left.row, left.col);
    }

    if (up &&
        up.crop === plot.crop &&
        left &&
        left.crop === plot.crop &&
        upReg !== leftReg) {
          region = this.mergeRegions(plot.crop, upReg, leftReg);
    } else if (up && up.crop === plot.crop) {
      region = upReg;
    } else if (left && left.crop === plot.crop) {
      region = leftReg;
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
        const region = !crop.regions.length ? crop.addRegion() : this.chooseRegionForPlot(plot);
        region.addPlot(plot);
        this.saveCoordRegion(row, col, cropSymbol, region.id);
      }
    }
  }

  calculateFencingPrice() {
    const price = this.crops.reduce((farmTotal, crop) => {
      return farmTotal += crop.regions.reduce((cropTotal, region) => {
        return cropTotal += region.area * region.perimeter;
      }, 0);
    }, 0);

    return price;
  }
}

const myStupidFarm = new Farm(farmArray);

myStupidFarm.plotMap();

console.log(myStupidFarm.calculateFencingPrice());
