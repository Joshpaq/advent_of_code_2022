console.time('runTime');
const fs = require('fs');
const instructions = fs
  .readFileSync('../input/instructions.txt', 'utf8')
  .split('\r\n');

const loop = [];
instructions.forEach((i) => {
  const parts = i.split(' ');
  loop.push(parts[0]);
  if (parts[0] !== 'noop') {
    loop.push(parseInt(parts[1]));
  }
});

let x = 1;
// const x_hist = [1];
const targets = [20, 60, 100, 140, 180, 220];
let totalStrength = 0;
for (let cy = 0; cy < loop.length; cy++) {
  const cycle = cy + 1;
  if (targets.includes(cycle)) {
    const sigStr = cycle * x;
    totalStrength += sigStr;
  }

  if (typeof loop[cy] === 'number') x += loop[cy];
  // x_hist[cycle] = x;
}

// for (let t of targets) {
//   console.log(`X @ Cycle ${t} =`, x_hist[t - 1]);
// }

console.log('Signal Strength ->', totalStrength);
console.timeEnd('runTime');
