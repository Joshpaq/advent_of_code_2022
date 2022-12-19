const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

async function main () {
  const treeGrid = [] // will be 2D array of integers

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    const trees = line
      .split('')
      .map(t => {
        return parseInt(t)
      })
    treeGrid.push(trees)
  })

  await events.once(inputLineReader, 'close')

  const gHeight = treeGrid.length
  const gWidth = treeGrid[0].length
  console.log(`the tree grid is ${gWidth}x${gHeight}`)

  const treesVisible = []
  for (let gY = 0; gY < gHeight; gY++) {
    for (let gX = 0; gX < gWidth; gX++) {
      if ((gY === 0) || (gX === 0) || (gY === gHeight - 1) || (gX === gWidth - 1)) { // this is an edge tree
        treesVisible.push({x: gX, y: gY})
      } else {
        const treeHeight = treeGrid[gY][gX]

        const neswTrees = [
          treeGrid.slice(0, gY).map(r => r[gX]),  // NORTH
          treeGrid[gY].slice(gX + 1),             // EAST
          treeGrid.slice(gY + 1).map(r => r[gX]), // SOUTH
          treeGrid[gY].slice(0, gX)               // WEST
        ]

        const isVisible = neswTrees.some(d => {
          const isVis = d.every(t => {
            return t < treeHeight
          })
          return isVis
        })
        if (isVisible) {
          treesVisible.push({x: gX, y: gY})
        }
      }
    }
  }

  console.log(`there are ${treesVisible.length} trees visible from outside the grid`)
}

main()
  .catch(console.error)