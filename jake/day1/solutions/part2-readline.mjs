console.time('runTime');
import { once } from 'events';
import { createReadStream } from 'fs';
import * as readline from 'node:readline/promises';

// Track X number of elfs at the top
const FIND_TOP_X = 3;

(async function () {
  const rl = readline.createInterface({
    input: createReadStream('../input/calories.txt'),
    crlfDelay: Infinity, // Make "\r\n" a single newline
  });

  const topElves = Array(FIND_TOP_X).fill(0);

  const documentElf = (elfCal) => {
    let hit = false;
    for (let i = 0; i < topElves.length; i++) {
      if (elfCal > topElves[i]) {
        hit = true;
        topElves[i] = curElf;
        break;
      }
    }

    if (hit) {
      // resort if we had a hit.
      topElves.sort((a, b) => {
        if (a > b) return 1;
        else if (a < b) return -1;
        else return 0;
      });
    }
  };

  let curElf = 0;
  rl.on('line', (line) => {
    if (line === '') {
      // elf calorie count complete, time to see if they're in the top.
      documentElf(curElf);
      curElf = 0;
    } else {
      curElf += parseInt(line);
    }
  });

  // Wait until entire file read to proceed
  await once(rl, 'close');
  documentElf(curElf);

  console.log(topElves.reduce((tot, cal) => (tot += cal), 0));
})();
console.timeEnd('runTime');
