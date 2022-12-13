console.time('runTime');
import { once } from 'events';
import { createReadStream } from 'fs';
import * as readline from 'node:readline/promises';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function getPriority(char) {
  // Search lowercase first, then handle for uppercase.
  let idx = alphabet.indexOf(char);
  if (idx !== -1) return idx + 1;
  idx = alphabet.indexOf(char.toLowerCase());
  return idx + 27;
}

function findCommonChar(str1, str2) {
  for (const char of str1.split('')) {
    if (str2.indexOf(char) !== -1) {
      return char; // stop if we find a match!
    }
  }
}

(async function () {
  const rl = readline.createInterface({
    input: createReadStream('../input/sacks.txt'),
    crlfDelay: Infinity, // Make "\r\n" a single newline
  });

  let total = 0;
  rl.on('line', (line) => {
    const halfLine = line.length / 2;
    total += getPriority(
      findCommonChar(line.substring(0, halfLine), line.substring(halfLine))
    );
  });

  // Wait until entire file read to proceed
  await once(rl, 'close');

  console.log('Total >>', total);

  console.timeEnd('runTime');
})();
