const fs = require('fs');
const { cachedDataVersionTag } = require('v8');

const data = fs
  .readFileSync('../input/sand.txt', 'utf8')
  /* ⬇⬇ You're going to have to trust me on this one, lol. ⬇⬇ */
  .split('\r\n')
  .map((x) => x.split(' -> ').map((y) => y.split(',').map((z) => parseInt(z))));

function generateCave(wallData) {
  // Determine size of cave by looking for Max and Min of X & Y
  const x = { min: 999999, max: 0 };
  const y = { min: 999999, max: 0 };
  for (const wall of wallData) {
    for (const line of wall) {
      if (line[0] < x.min) x.min = line[0];
      if (line[0] > x.max) x.max = line[0];
      if (line[1] < y.min) y.min = line[1];
      if (line[1] > y.max) y.max = line[1];
    }
  }

  x.min--;

  const cave = {
    sandSpout: [500 - x.min, 0],
    width: x.max - x.min + 3,
    x,
    y,
    grid: [],
  };

  for (let i = 0; i <= y.max; i++) {
    cave.grid.push(Array(cave.width).fill('.'));
  }

  // Sand spout
  cave.grid[cave.sandSpout[1]][cave.sandSpout[0]] = '+';

  // Draw the walls
  for (const wall of wallData) {
    for (let i = 1; i < wall.length; i++) {
      const start = wall[i - 1];
      const end = wall[i];

      if (start[0] === end[0]) {
        // vertical line
        const yMax = Math.max(start[1], end[1]);
        const yMin = Math.min(start[1], end[1]);
        for (let p = yMin; p <= yMax; p++) {
          cave.grid[p][start[0] - cave.x.min] = '#';
        }
      }

      if (start[1] === end[1]) {
        // horizontal line
        const xMax = Math.max(start[0], end[0]);
        const xMin = Math.min(start[0], end[0]);
        for (let p = xMin; p <= xMax; p++) {
          cave.grid[start[1]][p - cave.x.min] = '#';
        }
      }
    }
  }

  return cave;
}

function displayCave(c) {
  // Add numbers
  const numStrLength = c.grid.length.toString().length;
  for (let i = 0; i < c.grid.length; i++) {
    let rowNum = i.toString();
    while (rowNum.length < numStrLength) rowNum = ` ${rowNum}`;
    c.grid[i].unshift(`${rowNum}|`);
  }

  // display it
  for (const row of c.grid) {
    console.log(`${row.join(' ')} |`);
  }
}

function dropSand(cave) {
  const findNext = (x, y) => {
    if (cave.grid[y][x] !== '.' || y + 1 >= cave.grid.length) {
      return [null, null];
    }

    const possible = [
      [x, y + 1], // down + straight
      [x - 1, y + 1], // down + left
      [x + 1, y + 1], // down + right
    ];

    // Find first . of possible...
    const next = possible.find(([cx, cy]) => {
      return cave.grid[cy][cx] === '.';
    });

    if (next) {
      // we found a direction we can go!
      return findNext(next[0], next[1]); // do it again!
    } else {
      return [x, y];
    }
  };

  const [sandx, sandy] = cave.sandSpout;
  const nextCoordinate = findNext(sandx, sandy + 1);
  if (nextCoordinate[0] === null || nextCoordinate[1] === null) {
    return false;
  } else {
    cave.grid[nextCoordinate[1]][nextCoordinate[0]] = 'o';
    return true;
  }
}

const myCave = generateCave(data);
let sandCount = 0;
while (dropSand(myCave)) {
  sandCount++;
}
displayCave(myCave);
console.log(`SAND COUNT >>`, sandCount);
