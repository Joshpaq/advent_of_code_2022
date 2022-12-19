const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')
const { createCanvas } = require('canvas')

class Cave {

  constructor (caveInput = [], sandOrigin = [500, 0]) {
    this.sandOrigin = sandOrigin

  }

}

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

async function loadCaveFromPath (inputPath) {
  const caveInput = []

  const inputLineReader = readline.createInterface({
    input: createReadStream(inputPath, 'utf-8')
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

  return new Cave(caveInput)
}

async function main () {
  const cave = await loadCaveFromPath(path.resolve(process.argv[2]))

  const canvas = createCanvas(1080, 1080)
  const ctx = canvas.getContext('2d')

  ctx.font = '30px Impact'
  ctx.rotate(0.1)
  ctx.fillText('Awesome!', 50, 100)

  // Draw line under text
  var text = ctx.measureText('Awesome!')
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.lineTo(50, 102)
  ctx.lineTo(50 + text.width, 102)
  ctx.stroke()

  while (cave.state !== cave.STATE_FULL) {
    cave.addSand()
  }
}

main()
  .catch(console.error)
