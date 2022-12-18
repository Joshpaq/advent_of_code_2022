const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')
const { secureHeapUsed } = require('crypto')

const SAND_ORIGIN = [500,0]
const SAND = '0'
const AIR = '.'
const ROCK = '#'
const VOID = '_'

function buildCave (caveInput) {
  const caveMaxPos = [-1,-1]
  const cave = []

  // determine extents of the cave and fill the cave with air + a void layer
  for (let segments of caveInput) {
    for (let segment of segments) {
      if (segment[0] > caveMaxPos[0]) {
        caveMaxPos[0] = segment[0]
      }

      if (segment[1] > caveMaxPos[1]) {
        caveMaxPos[1] = segment[1]
      }
    }
  }

  for (let y = 0; y < caveMaxPos[1] + 1; y++) {
    cave.push(new Array(caveMaxPos[0] + 1).fill(AIR))
  }
  cave.push(new Array(caveMaxPos[0] + 1).fill(VOID))

  // create rocks
  for (let segments of caveInput) {
    segments.reduce((memo, next) => {
      if (memo[0] === next[0]) { // vertical wall
        const [maxPos, minPos] = [memo[1], next[1]].sort((a, b) => b - a)
        for (let y = minPos; y <= maxPos; y++) {
          cave[y][memo[0]] = ROCK
        }
      } else if (memo[1] === next[1]) { // horizontal wall
        const [maxPos, minPos] = [memo[0], next[0]].sort((a, b) => b - a)
        for (let x = minPos; x <= maxPos; x++) {
          cave[memo[1]][x] = ROCK
        }
      } else {
        throw new Error('bad rock construction')
      }

      return next
    })
  }

  return cave
}

function addSand (cave) {
  let sandState = 'FALLING'
  const sand = [...SAND_ORIGIN]
  while (sandState === 'FALLING') {
    // get the left, center, and right positions below the sand      
    const [left, center, right] = cave[sand[1] + 1].slice(sand[0] - 1, sand[0] + 2)

    if (center === AIR) { // falling
      sand[1]++
    } else if (center === ROCK || center === SAND) {
      if (left === AIR) { // fall left diagonally
        sand[0]--
        sand[1]++
      } else if (right === AIR) {
        sand[0]++
        sand[1]++
      } else {
        cave[sand[1]][sand[0]] = SAND
        sandState = 'RESTING'
      }
    } else if (center === VOID) {
      sandState = 'VOID'
    }
  }
  
  return sandState
}

async function main () {
  const caveInput = []

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    const segments = line.split('->')
      .map((position) => {
        return position.split(',')
          .map((coord) => parseInt(coord.trim()))
      })
    caveInput.push(segments)
  })
  
  await events.once(inputLineReader, 'close')

  const cave = buildCave(caveInput)
  let caveState = 'INITIAL'
  let sandCount = 0
  
  while (caveState !== 'VOID') {
    caveState = addSand(cave)
    if (caveState !== 'VOID') {
      sandCount++
    }
  }

  for (const layer of cave) {
    console.log(layer.reduce((memo, next) => memo + next))
  }

  console.log(`the cave holds: ${sandCount} units of sand`)
}

main()
  .catch(console.error)