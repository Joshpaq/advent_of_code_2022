console.time('runTime');
const fs = require('fs');
const calorieData = fs
  .readFileSync('../input/calories.txt', 'utf8')
  .split('\r\n');

const elfs = [];
let curElf = 0;
for (const calories of calorieData) {
  if (calories === '') {
    elfs.push(curElf);
    curElf = 0; // reset
  } else {
    curElf += parseInt(calories);
  }
}
// Push the last elf
elfs.push(curElf);

// Sort DESC
elfs.sort((a, b) => {
  if (a > b) return -1;
  else if (a < b) return 1;
  else return 0;
});

// Add calories of top 3.
console.log(elfs.splice(0, 3).reduce((accum, c) => (accum += c), 0));

console.timeEnd('runTime');
