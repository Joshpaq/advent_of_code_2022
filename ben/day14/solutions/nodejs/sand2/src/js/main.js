import * as PIXI from 'pixi.js'

import caveInput from '../assets/cave.txt'
import Cave from './cave.js'

const SCALE_FACTOR = 4

const FALLING_SAND_COLOR = 0xEEf20A
const RESTING_SAND_COLOR = 0x747520
const ROCK_COLOR = 0x6B6B6B
const FLOOR_COLOR = 0x424242

function drawCave (graphics , cave) {
  for (let cy = 0; cy < cave.depth; cy++) {
    for (let cx = 0; cx < cave.width; cx++) {
      let color
      switch (cave.interior[cy][cx]) {
        case 1:
          color = RESTING_SAND_COLOR
          break
        case 2:
          color = ROCK_COLOR
          break
        case 3:
          color = FLOOR_COLOR
          break
      }

      if (color) { // not air, draw a 4x4 rectange
        graphics.beginFill(color)
        graphics.drawRect(cx * SCALE_FACTOR, cy * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR)
        graphics.endFill()
      }
    }
  }

  for (let sand of cave.fallingSand) {
    graphics.beginFill(FALLING_SAND_COLOR)
    graphics.drawRect(sand[0] * SCALE_FACTOR, sand[1] * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR)
    graphics.endFill()
  }
}

function main () {
  console.log(caveInput)
  const processedCaveInput = caveInput
    .split('\n')
    .map(line => {
      return line.split('->') 
        .map((position) => {
          return position.split(',')
            .map((coord) => parseInt(coord.trim()))
        })
    })
  console.log(JSON.stringify(processedCaveInput))

  const cave = new Cave(processedCaveInput)

  const app = new PIXI.Application({
    width: cave.width * SCALE_FACTOR,
    height: cave.depth * SCALE_FACTOR,
    resolution: window.devicePixelRatio || 1
  })
  document.body.appendChild(app.view)

  const graphics = new PIXI.Graphics()
  drawCave(graphics, cave)

  app.stage.addChild(graphics)

  app.ticker.add((delta) => {
    graphics.clear()
    drawCave(graphics, cave)
  })

  setInterval(() => {
    cave.addSand()
  }, 1)
}

main()