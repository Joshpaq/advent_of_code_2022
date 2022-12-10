/**
 * The RopeKnot manages the coordinates of a knot.
 * @class RopeKnot
 */
class RopeKnot {
  constructor(id, fKnot = null) {
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.fKnot = fKnot; // Ref to a RopeKnot instance of the knot following this knot.
    this.history = [[0, 0]];
  }

  /**
   * Track the current position of this knot.
   */
  addHistory() {
    // Only track location if this knot does not have a follower knot,
    // which indicates that "this" knot is the tail knot. (we only care about location of tail)
    if (!this.fKnot) this.history.push(this.getPos());
  }

  getPos() {
    return [this.x, this.y];
  }

  /**
   * Move this knot in a given direction for a given distance.
   * Special note: This knot will inform it's follower knot (if applicable) that it has moved,
   * and that follower knot will inform it's follower knot, and so on, until there is no follower knot.
   * @param {string<U,D,L,R>} direction Character indicating direction to move (U, D, L, R)
   * @param {number} distance The distance to move in the given direction.
   */
  move(direction, distance) {
    for (let i = 0; i < distance; i++) {
      // First move this knot.
      switch (direction) {
        case 'U':
          this.y++;
          break;
        case 'D':
          this.y--;
          break;
        case 'L':
          this.x--;
          break;
        case 'R':
          this.x++;
          break;
        default:
          break; // do nothing if invalid direction
      }

      // Notify follower of position update
      if (this.fKnot) this.fKnot.follow(this);

      this.addHistory();
    }
  }

  /**
   * Determine if this knot is touching the given knot.
   * @param {RopeKnot} hKnot
   * @returns {boolean} True if touching
   */
  isTouching(hKnot) {
    const diffX = Math.abs(this.x - hKnot.x);
    const diffY = Math.abs(this.y - hKnot.y);
    return diffX <= 1 && diffY <= 1;
  }

  /**
   * This describes out a knot should follow the given "head" knot.
   * Special note: Think of this as being called by the "head" knot. A knot doesn't tell itself to follow ;)
   * @param {RopeKnot} hKnot Head knot (the one this knot is following)
   * @returns {void}
   */
  follow(hKnot) {
    if (this.isTouching(hKnot)) return; // do nothing;

    // get position of knot we're following
    const [x, y] = hKnot.getPos();

    // Determine where to move
    const diffX = this.x - x;
    const diffY = this.y - y;

    // Move..
    if (diffX > 0) this.x--;
    else if (diffX < 0) this.x++;

    if (diffY > 0) this.y--;
    else if (diffY < 0) this.y++;

    // Inform our follower (if applicable)
    if (this.fKnot) this.fKnot.follow(this);

    this.addHistory();
  }
}

/**
 * This rope class contains all of the knots in the rope. It is used to
 * move the HEAD knot around, as well as output location information for
 * each of the knots.
 * @class Rope
 */
class Rope {
  constructor(numKnots) {
    this.knots = [];

    for (let i = numKnots - 1; i >= 0; i--) {
      if (this.knots.length === 0) {
        this.knots.push(new RopeKnot(i));
      } else {
        let lastKnot = this.knots[this.knots.length - 1];
        this.knots.push(new RopeKnot(i, lastKnot));
      }
    }

    this.T = this.knots[0];
    this.H = this.knots[this.knots.length - 1];

    this.T.id = 'T';
    this.H.id = 'H';
  }

  /**
   * Moves the head knot around
   * @param {Array<Array<string,number>>} moves Moves to make, each move being an array [char,number]
   * @param {number} limit
   * @returns {Rope} itself (for chaining)
   */
  processMoves(moves, limit = null) {
    const moveCount = limit ? limit : moves.length;
    for (let i = 0; i < moveCount; i++) {
      this.H.move(moves[i][0], moves[i][1]);
    }

    return this;
  }

  /**
   * Helper to determine the number of unique postions the tail has visited
   * @returns {number} The unique number of positions
   */
  getUniqueTailVisits() {
    let visited = new Set();
    for (let h of this.T.history) {
      visited.add(h.join(','));
    }
    return visited.size;
  }

  /**
   * Output a fancy table showing coordinates of each knot, number of moves,
   * and finally the number of unique moves for the TAIL knot.
   */
  outputResults() {
    const table = {};
    const lastId = this.T.id;
    for (const knot of this.knots) {
      const pos = knot.getPos();
      let knotName = `Knot ${knot.id}`;
      if (knot.id === 0) knotName = 'TAIL KNOT';
      else if (knot.id === this.knots.length - 1) knotName = 'HEAD KNOT';

      table[knotName] = {
        x: pos[0],
        y: pos[1],
        moves: knot.history.length,
        uniq_moves: knot.id === lastId ? this.getUniqueTailVisits() : null,
      };
    }
    console.table(table);

    // DEBUG - Visualize current position of each knot
    // console.log(this.outputHistoryASCII());
  }

  /**
   * This creates a visual of each knot location for debugging.
   */
  outputHistoryASCII() {
    // TODO - Calculate these values instead of hard coding them
    const numRows = 30;
    const numCols = 30;
    const offsetX = 12;
    const offsetY = 11;

    const graph = [];
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (!graph[i]) graph[i] = [];
        graph[i].push('.');
      }
    }

    for (let k = this.knots.length - 1; k >= 0; k--) {
      const knot = this.knots[k];
      const [x, y] = knot.getPos();
      graph[y + offsetY][x + offsetX] = knot.id;
    }

    graph[offsetY][offsetX] = 'S';

    console.log(
      graph
        .map((row) => {
          return row.join(' ');
        })
        .reverse()
        .join('\n')
    );
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
const b = new Rope(10);

// Add a 2nd arg to processMoves() to specify the number of moves to make (for debugging)
b.processMoves(moveInput).outputResults();
console.log('Answer: ', b.getUniqueTailVisits());
