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

const NUM_COLS = 40;
const NUM_ROWS = 6;
const NUM_PIX = NUM_COLS * NUM_ROWS;
const CRT = Array(NUM_PIX).fill('.');

let x = 1;
const targets = [20, 60, 100, 140, 180, 220];
let totalStrength = 0;
for (let cy = 0; cy < loop.length; cy++) {
  const cycle = cy + 1;
  if (targets.includes(cycle)) {
    const sigStr = cycle * x;
    totalStrength += sigStr;
  }

  if (
    cy % NUM_COLS === x - 1 ||
    cy % NUM_COLS === x ||
    cy % NUM_COLS === x + 1
  ) {
    CRT[cy] = '#';
  }

  if (typeof loop[cy] === 'number') x += loop[cy];
}

console.log('Signal Strength ->', totalStrength);

console.log(
  Array.from({ length: NUM_ROWS }, (v, i) => {
    return CRT.slice(i * NUM_COLS, i * NUM_COLS + NUM_COLS).join('');
  }).join('\n')
);

console.timeEnd('runTime');
