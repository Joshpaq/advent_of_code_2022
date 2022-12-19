class Cave {
  static AIR = 0
  static SAND = 1
  static ROCK = 2
  static FLOOR = 3

  interior = []
  width = -1
  depth = -1

  fallingSand = []

  constructor (caveInput, originalSpawn = 500) {
    // determine cave depth, width, sand spawn point
    let lowestRockPos = -1
    let widestRockPos = -1
    for (let segments of caveInput) {
      for (let segment of segments) {
        if (segment[0] > widestRockPos) {
          widestRockPos = segment[0]
        }
        if (segment[1] > lowestRockPos) {
          lowestRockPos = segment[1]
        }
      }
    }
    this.depth = lowestRockPos + 3 // plus 1 for position vs. count then plus 2 for floor below lowest rock
    this.width = ((this.depth * 2) - 1) + 2 // largest that the width can be plus 2 for an air gap
    this.sandSpawn = [(this.width + 1) / 2, 0] // width is always odd, this ensures spawn is at center

    // cave interior is currently unscaled, we will go off of caveInput initially
    for (let y = 0; y < this.depth - 1; y++) {
      this.interior.push(new Array(originalSpawn + this.depth).fill(Cave.AIR))
    }
    this.interior.push(new Array(originalSpawn + this.depth).fill(Cave.FLOOR))

    // create rocks 
    for (let segments of caveInput) {
      segments.reduce((memo, next) => {
        if (memo[0] === next[0]) { // vertical wall
          const [maxPos, minPos] = [memo[1], next[1]].sort((a, b) => b - a)
          for (let y = minPos; y <= maxPos; y++) {
            this.interior[y][memo[0]] = Cave.ROCK
          }
        } else if (memo[1] === next[1]) { // horizontal wall
          const [maxPos, minPos] = [memo[0], next[0]].sort((a, b) => b - a)
          for (let x = minPos; x <= maxPos; x++) {
            this.interior[memo[1]][x] = Cave.ROCK
          }
        } else {
          throw new Error('bad rock construction')
        }
        return next
      })
    }

    // scale the cave, the sand pyramid can only be 2x depth - 1 so we take the origin and scale around it
    for (let y = 0; y < this.depth; y++) {
      // level.splice(originalSpawn + (this.depth - 1) ) // remove right side first for convenience
      this.interior[y].splice(0, originalSpawn - this.sandSpawn[0])
    }
  } 

  addSand () {
    // ensure that spawn is not clogged
    if (this.interior[this.sandSpawn[1]][this.sandSpawn[0]] === Cave.AIR) {
      // process all of the falling sand from oldest to newest
      const newRestingSands = []
      for (let sand of this.fallingSand) {
        const [left, center, right] = this.interior[sand[1] + 1].slice(sand[0] - 1, sand[0] + 2)
        if (center === Cave.AIR) { // falling
          sand[1]++
        } else {
          if (left === Cave.AIR) { // fall left diagonally
            sand[0]--
            sand[1]++
          } else if (right === Cave.AIR) {
            sand[0]++
            sand[1]++
          } else {
            this.interior[sand[1]][sand[0]] = Cave.SAND
            newRestingSands.push(sand)
          }
        } 
      }

      // remove any of the resting sand
      for (let sand of newRestingSands) {
        this.fallingSand.splice(this.fallingSand.indexOf(sand), 1)
      }

      // finally, add a new unit of falling sand at the sandSpawn
      this.fallingSand.push([this.sandSpawn[0], this.sandSpawn[1]])
    }
  }
}

export default Cave
