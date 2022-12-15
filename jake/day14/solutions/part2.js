console.time('runTime');
const fs = require('fs');

const SANDSPOUT = [500, 0];

const data = fs
  .readFileSync('../input/sand.txt', 'utf8')
  /* ⬇⬇ You're going to have to trust me on this one, lol. ⬇⬇ */
  .split('\r\n')
  .map((x) => x.split(' -> ').map((y) => y.split(',').map((z) => parseInt(z))));

function generateCave(wallData, hasFloor) {
  // Determine height of cave by looking for Max and Min of X & Y
  const yValues = wallData.map((r) => r.map((w) => w[1])).flat();
  const ymax = Math.max(...yValues);

  const cave = {
    width: SANDSPOUT[0] * 2,
    height: hasFloor ? ymax + 2 : ymax,
    grid: [],
  };

  for (let i = 0; i <= cave.height; i++) {
    cave.grid.push(Array(cave.width).fill('.'));
  }

  if (hasFloor) {
    cave.grid.pop(); // ditch last row and replace with rock floor.
    cave.grid.push(Array(cave.width).fill('#'));
  }

  // Sand spout
  cave.grid[SANDSPOUT[1]][SANDSPOUT[0]] = '+';

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
          cave.grid[p][start[0]] = '#';
        }
      }

      if (start[1] === end[1]) {
        // horizontal line
        const xMax = Math.max(start[0], end[0]);
        const xMin = Math.min(start[0], end[0]);
        for (let p = xMin; p <= xMax; p++) {
          cave.grid[start[1]][p] = '#';
        }
      }
    }
  }

  return cave;
}

function dropSand(cave) {
  const findNext = (x, y) => {
    if (
      (cave.grid[y][x] !== '.' && cave.grid[y][x] !== '+') ||
      y + 1 >= cave.grid.length
    ) {
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

    return next
      ? findNext(next[0], next[1]) // we found a direction we can go, do it again!
      : [x, y]; // landed on something, cannot go further.
  };

  const findNextWhile = (x, y) => {
    let pVal = cave.grid[y][x];

    if ((pVal !== '.' && pVal !== '+') || y + 1 >= cave.grid.length) {
      return [null, null];
    }

    do {
      pVal = cave.grid[y][x];

      if (y + 1 >= cave.grid.length) break;

      const possible = [
        [x, y + 1], // down + straight  // BEST
        [x - 1, y + 1], // down + left  // BETTER
        [x + 1, y + 1], // down + right // GOOD
      ];

      // Find first . of possible...
      const next = possible.find(([cx, cy]) => cave.grid[cy][cx] === '.');

      if (next) {
        x = next[0];
        y = next[1];
        pVal = cave.grid[y][x];
      } else {
        pVal = null;
      }
    } while (pVal === '.' || pVal === '+');

    return [x, y];
  };

  const [sandx, sandy] = SANDSPOUT;
  const nextCoordinate = findNextWhile(sandx, sandy);
  if (nextCoordinate[0] === null || nextCoordinate[1] === null) {
    return false;
  } else {
    // Update the grid value to track the sand.
    cave.grid[nextCoordinate[1]][nextCoordinate[0]] = 'o';
    return true;
  }
}

const myCave = generateCave(data, /* hasFloor */ true);
let sandCount = 0;
while (dropSand(myCave)) {
  sandCount++;
}
console.log(`SAND COUNT >>`, sandCount);
console.timeEnd('runTime');
