import caveInput from '../assets/test_cave.txt'
import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
  width: 720,
  height: 720,
  resolution: window.devicePixelRatio || 1
})
document.body.appendChild(app.view)

const graphics = new PIXI.Graphics()
graphics.beginFill(0xDE3249)
graphics.drawRect(0,0,4,4)
graphics.endFill()

app.stage.addChild(graphics)