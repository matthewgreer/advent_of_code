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
    // returns whether the plots to the left, up, right, and down are different crops (or edges of the map)
    let borders = {
      "left": this.col > 0 ? this.map[this.row][this.col - 1] !== this.crop : true,
      "up": this.row > 0 ? this.map[this.row - 1][this.col] !== this.crop : true,
      "right": this.col < this.map[0].length - 1 ? this.map[this.row][this.col + 1] !== this.crop : true,
      "down": this.row < this.map.length - 1 ? this.map[this.row + 1][this.col] !== this.crop : true
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
      this.plots = []
  }

  addPlot(plot) {
    this.plots.push(plot);
  }

  getPlot(row, col) {
    const plot = this.plots.find(plot => plot.row === row && plot.col === col);
    return plot;
  }

  get area() {
    return this.plots.length;
  }

  get perimeter() {
    return this.plots.reduce((total, plot) => total += plot.perimeter, 0);
  }

  sides() {
    // pathfind around the perimeter of the region, counting sides at changes in direction

    const directions = ["up", "right", "down", "left"];
    const vectors = {
      "up": [-1, 0],
      "right": [0, 1],
      "down": [1, 0],
      "left": [0, -1]
    };
    let sides = 0;
    const startingPlot = this.plots[0];

    // console.log("region id", this.id);

    // console.log("startingPlot", startingPlot.row, startingPlot.col);

    const startingDirection = 1 // meaning "right"
    // const visited = [] // stack for `row, col` key <--- maybe... is this necessary? backtracking?

    let currentPlot = startingPlot;
    let travellingDirection = startingDirection
    let outsideDirection = 0 // meaning "up"
    let started = false;

    const moveToNextPlot = (plot) => {

      // console.log("calling moveToNextPlot(", plot.row, plot.col, ")")

      let row = plot.row,
          col = plot.col,
          [vr, vc] = vectors[directions[travellingDirection]];
      // visited.push(`${row},${col}`); // ??? idk if necessary
      // move to the next plot
      const nextPlot = this.getPlot(row + vr, col + vc);

      // console.log("nextPlot is", nextPlot.row, nextPlot.col, "crop", nextPlot.crop);

      // TODO: WHAT IF IT ISN'T FOUND??
      return nextPlot
    };

    const turn = (direction) => {
      // THE LOGIC FOR COUNTING SIDES ISN'T YET RIGHT.
      // console.log("---");
      // console.log("recording that side")

      sides ++;

      // console.log("sides", sides);
      // console.log("turning", direction);

      const turn = direction === "right" ? 1 : -1;

      // console.log("-->  travelling", travellingDirection, "+", turn, "=", (4 + travellingDirection + turn) % 4);
      // console.log("-->  outside", outsideDirection, "+", turn, "=", (4 + outsideDirection + turn) % 4);

      const newTravellingDirection = ((4 + travellingDirection + turn) % 4);
      const newOutsideDirection = ((4 + outsideDirection + turn) % 4);

      // console.log("travellingDirection changed from", directions[travellingDirection], "to", directions[newTravellingDirection]);
      // console.log("outside direction changed from", directions[outsideDirection], "to", directions[newOutsideDirection]);

      travellingDirection = newTravellingDirection;
      outsideDirection = newOutsideDirection;
    }
    // start with the first plot in this.plots. the first plot of a Region must perforce have a border on the left and the top. we'll start there and move right along the top side.

    while (!started || !(currentPlot === startingPlot && travellingDirection === startingDirection)) {
      started = true;

      // console.log("===");
      // console.log("BEGINNING OF LOOP");
      // console.log("currentPlot", currentPlot.row, currentPlot.col, "crop", currentPlot.crop, ", facing", directions[travellingDirection]);
      // console.log("plot borders", currentPlot.borders);
      // console.log("checking outside (", directions[outsideDirection], ")...")

      if (currentPlot.borders[directions[outsideDirection]]){
        // block outside, try ahead

        // console.log("border outside (", directions[outsideDirection],")! try to move ahead -->", directions[travellingDirection])

        if (!currentPlot.borders[directions[travellingDirection]]) {

          // console.log("no border ahead! stepping forward", directions[travellingDirection]);

          let nextPlot = moveToNextPlot(currentPlot);

          // console.log("setting currentPlot", currentPlot.row, currentPlot.col, "to nextPlot", nextPlot.row, nextPlot.col);

          currentPlot = nextPlot;

        } else {
          // block outside and ahead, turn inside

          // console.log("block ahead! end of side.")
          turn("right")
        }
      } else {
        // no block outside, turn outside
        turn("left");

        let nextPlot = moveToNextPlot(currentPlot);

        // console.log("setting currentPlot", currentPlot.row, currentPlot.col, "to nextPlot", nextPlot.row, nextPlot.col);

        currentPlot = nextPlot;
      }
      // console.log("should be looping because started is", started, "but currentPlot === startingPlot && travellingDirection === startingDirection is still false ->", !(currentPlot === startingPlot && travellingDirection === startingDirection));
    }

    // console.log("We've come back to the start.")
    return sides;

    /*
      0 1 2 3 4 5 6 7 8           0 1 2 3 4 5 6 7 8
    0             C C                         - +
    1             C > C                         +
    2           C C
    3       C C C
    4         C     C
    5         C C
    6           C

    side 1: 0,6 -> 0,7 top        side  8: 2,5 -> 3,5 right     side 15: 5,5 -> 5,4 bottom    side 22: 2,6 -> 0,6 left
    side 2: 0,7 -> 1,7 right      side  9: 3,5 -> 3,4 bottom    side 16: 5,4 -> 3,4 left      STOP: 0,6 top
    side 3: 1,7 -> 1,8 top        side 10: 3,4 -> 5,4 right     side 17: 3,4 -> 3,3 bottom
    side 4: 1,8 right             side 11: 5,4 -> 5,5 top       side 18: 3,3 left
    side 5: 1,8 -> 1,6 bottom     side 12: 5,5 -> 6,5 right     side 19: 3,3 -> 3,5 top
    side 6: 1,6 -> 2,6 right      side 13: 6,5 bottom           side 20: 3,5 -> 2,5 left
    side 7: 2,6 -> 2,5 bottom     side 14: 6,5 -> 5,5 left      side 21: 2,5 -> 2,6 top

    Ok at 1,7 facing right we check up and there's no border so we count a side and turn back up. so does a left turn (to the outside) need to be a turn without incrementing sides? should it step forward first?
    */
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
        return cropTotal += region.area * region.sides();
      }, 0);
    }, 0);

    return price;
  }
}


// const inputString = "AAAA\nBBCD\nBBCC\nEEEC";
const inputString = "AAAAAA\nAAABBA\nAAABBA\nABBAAA\nABBAAA\nAAAAAA"

// const inputString = "RRRRIICCFF\nRRRRIICCCF\nVVRRRCCFFF\nVVRCCCJFFF\nVVVVCJJCFE\nVVIVCCJJEE\nVVIIICJJEE\nMIIIIIJJEE\nMIIISIJEEE\nMMMISSJEEE\n";
// const inputString = input;

const farmArray = farm(inputString);
const myStupidFarm = new Farm(farmArray);

myStupidFarm.plotMap();
myStupidFarm.crops.forEach(c => {
  c.regions.forEach(r => {
    console.log("crop", c.symbol, "id", r.id, "sides", r.sides());
  });
});

// const cCrop = myStupidFarm.getCrop("C");

// const r = cCrop.regions[0];

// cCrop.regions.forEach(r => {
  // const sides = r.sides(),
  //       area = r.area;
  // console.log("")
  // console.log("REGION ID:", r.id, "HAS", sides, "SIDES!");
  // console.log("AND AN AREA OF", area);
  // console.log("SO FENCING COSTS", sides * area)
  // console.log("")
// })

console.log(myStupidFarm.calculateFencingPriceByPerimeter());
console.log(myStupidFarm.calculateFencingPriceBySides());
