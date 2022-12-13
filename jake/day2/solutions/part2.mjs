console.time('runTime');
import { once } from 'events';
import { createReadStream } from 'fs';
import * as readline from 'node:readline/promises';

const PLAY = {
  DRAW: 3,
  WIN: 6,
  LOSS: 0,
  ROCK: 1,
  ROCK_WIN: 'SCISSORS',
  ROCK_LOSS: 'PAPER',
  PAPER: 2,
  PAPER_WIN: 'ROCK',
  PAPER_LOSS: 'SCISSORS',
  SCISSORS: 3,
  SCISSORS_WIN: 'PAPER',
  SCISSORS_LOSS: 'ROCK',
  A: 'ROCK',
  B: 'PAPER',
  C: 'SCISSORS',
  X: 'LOSS',
  Y: 'DRAW',
  Z: 'WIN',
};

function findPlay(targetOutcome, opponentPlay) {
  if (targetOutcome === 'DRAW') return opponentPlay; // Easy, play what they played.

  // Below may seem backwards at first glance, but you need
  // to play the hand that makes the opponent lose when you want to win,
  // and play the hand that makes the opponent win when you want to lose.
  return targetOutcome === 'WIN'
    ? PLAY[opponentPlay + '_LOSS']
    : PLAY[opponentPlay + '_WIN'];
}

function battle(p1, p2) {
  if (p1 === p2) {
    // DRAW
    return [PLAY[p1] + PLAY.DRAW, PLAY[p2] + PLAY.DRAW];
  }

  if (p1 === 'ROCK') {
    return p2 === 'SCISSORS'
      ? [PLAY[p1] + PLAY.WIN, PLAY[p2] + PLAY.LOSS] // vs. SCISSORS  (WIN)
      : [PLAY[p1] + PLAY.LOSS, PLAY[p2] + PLAY.WIN]; // vs. PAPER    (LOSS)
  }

  if (p1 === 'PAPER') {
    return p2 === 'ROCK'
      ? [PLAY[p1] + PLAY.WIN, PLAY[p2] + PLAY.LOSS] // vs. ROCK      (WIN)
      : [PLAY[p1] + PLAY.LOSS, PLAY[p2] + PLAY.WIN]; // vs. SCISSORS (LOSS)
  }

  if (p1 === 'SCISSORS') {
    return p2 === 'PAPER'
      ? [PLAY[p1] + PLAY.WIN, PLAY[p2] + PLAY.LOSS] // vs. PAPER     (WIN)
      : [PLAY[p1] + PLAY.LOSS, PLAY[p2] + PLAY.WIN]; // vs. ROCK     (LOSS)
  }

  // logically, shouldn't be able to get to this point,
  // assuming all input is either PAPER, ROCK, or SCISSORS.
  return [0, 0]; // but because it bothers me to not... ;)
}

(async function () {
  const rl = readline.createInterface({
    input: createReadStream('../input/plays.txt'),
    crlfDelay: Infinity, // Make "\r\n" a single newline
  });

  let p1Score = 0;
  let p2Score = 0;
  rl.on('line', (line) => {
    const [p1Play, p2Play] = line.split(' ');
    const battleResult = battle(
      PLAY[p1Play],
      findPlay(PLAY[p2Play], PLAY[p1Play])
    );
    p1Score += battleResult[0];
    p2Score += battleResult[1];
  });

  // Wait until entire file read to proceed
  await once(rl, 'close');
  console.log('Player 1 Score:', p1Score);
  console.log('Player 2 Score (me):', p2Score);
  console.timeEnd('runTime');
})();
