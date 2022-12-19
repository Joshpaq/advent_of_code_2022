/*const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')
*/
import * as path from 'path'
import { createReadStream } from 'fs'
import * as readline from 'readline'
import * as events from 'events'
import Cave from './cave.js'

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

  const cave = new Cave(caveInput, 500)

  for (let level of cave.interior) {
    console.log(level.reduce((memo, next) => memo + next.toString()), '')
  }
}

main()
  .catch(console.error)
