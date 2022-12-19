class RopeKnot {
  constructor(fKnot = null) {
    this.x = 0;
    this.y = 0;
    this.fKnot = fKnot; // reference to a RopeKnot instance for the knot following this knot.
    this.history = [[0, 0]];
  }

  addHistory(x, y) {
    this.history.push([x, y]);
  }

  getLastPosition() {
    return this.history.length === 0
      ? null
      : this.history[this.history.length - 1];
  }

  move(direction, distance) {
    // console.log(`-----------------= ${direction} ${distance}`);
    // console.log([this.x, this.y], [this.fKnot.x, this.fKnot.y]);
    for (let i = 0; i < distance; i++) {
      // First move this knot.
      switch (direction) {
        case 'U': // increment Y
          this.y++;
          break;
        case 'D': // decrement Y
          this.y--;
          break;
        case 'L': // decrement X
          this.x--;
          break;
        case 'R': // increment X
          this.x++;
          break;
        default:
          break; // do nothing if invalid direction
      }

      // Notify follower of last position
      if (this.fKnot) {
        // notify our follower
        this.fKnot.follow(this);
      }

      this.addHistory(this.x, this.y);

      // console.log([this.x, this.y], [this.fKnot.x, this.fKnot.y]);
    }
  }

  getPos() {
    return [this.x, this.y];
  }

  follow(hKnot) {
    // get position of knot we're following
    const [x, y] = hKnot.getPos();

    // determine if it is close enough
    const diffX = Math.abs(this.x - x);
    const diffY = Math.abs(this.y - y);

    // Determine if we need to move.
    if (diffX >= 2 || diffY >= 2) {
      // Get last position of knot we're following...
      const [lastX, lastY] = hKnot.getLastPosition();
      this.x = lastX;
      this.y = lastY;
      this.addHistory(this.x, this.y);
    }
  }
}

class Rope {
  constructor() {
    this.T = new RopeKnot();
    this.H = new RopeKnot(/* follower */ this.T);
  }

  processMoves(moves) {
    for (const [direction, distance] of moves) {
      this.H.move(direction, distance);
    }

    return this;
  }

  getUniqueTailVisits() {
    let visited = new Set();
    for (let h of this.T.history) {
      visited.add(h.join(','));
    }
    return visited.size;
  }

  outputResults() {
    const hPos = this.H.getPos();
    const tPos = this.T.getPos();

    console.table({
      'Head Knot': { x: hPos[0], y: hPos[1], moves: this.H.history.length },
      'Tail Knot': {
        x: tPos[0],
        y: tPos[1],
        moves: this.T.history.length,
        uniq_moves: this.getUniqueTailVisits(),
      },
    });
  }
}

// Read input
const fs = require('fs');
const moveInput = fs
  .readFileSync('../input/moves.txt', 'utf8')
  .split('\r\n')
  .map((x) => {
    const parts = x.split(' ');
    return [parts[0], parseInt(parts[1])];
  });
const b = new Rope();
b.processMoves(moveInput).outputResults();
