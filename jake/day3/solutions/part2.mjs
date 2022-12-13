console.time('runTime');
import { once } from 'events';
import { createReadStream } from 'fs';
import * as readline from 'node:readline/promises';

let alphabet = 'abcdefghijklmnopqrstuvwxyz';
alphabet += alphabet.toUpperCase();

function getPriority(char) {
  // Search lowercase first, then handle for uppercase.
  let idx = alphabet.indexOf(char);
  if (idx !== -1) return idx + 1;
}

function findBadge(str1, str2, str3) {
  const chars = str1.split('');
  for (let i = 0; i < chars.length; i++) {
    if (str2.indexOf(chars[i]) !== -1 && str3.indexOf(chars[i]) !== -1)
      return chars[i];
  }

  return 0;
}

(async function () {
  const rl = readline.createInterface({
    input: createReadStream('../input/sacks.txt'),
    crlfDelay: Infinity, // Make "\r\n" a single newline
  });

  let total = 0;
  let group = [];
  rl.on('line', (line) => {
    group.push(line);
    if (group.length === 3) {
      total += getPriority(findBadge(group[0], group[1], group[2]));
      group = []; // empty it.
    }
  });

  // Wait until entire file read to proceed
  await once(rl, 'close');

  console.log('Total >>', total);

  console.timeEnd('runTime');
})();
