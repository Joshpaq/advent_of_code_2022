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

console.log(Math.max(...elfs));

console.timeEnd('runTime');
