const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

function getViewingDistance (treeHeight, distantTrees) {
  let viewingDistance
  const distanceToTallestTree = distantTrees.findIndex(t => t >= treeHeight)
  if (distanceToTallestTree === -1) {
    viewingDistance = distantTrees.length
  } else {
    viewingDistance = (distanceToTallestTree + 1)
  }
  return viewingDistance
}

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

  const scoredTrees = []
  for (let gY = 0; gY < gHeight; gY++) {
    for (let gX = 0; gX < gWidth; gX++) {
      if ((gY === 0) || (gX === 0) || (gY === gHeight - 1) || (gX === gWidth - 1)) { // this is an edge tree
        scoredTrees.push({ x: gX, y: gY, score: 0 })
      } else {
        const treeHeight = treeGrid[gY][gX]
        const neswTrees = [
          treeGrid.slice(0, gY).map(r => r[gX]).reverse(),  // NORTH
          treeGrid[gY].slice(gX + 1),                       // EAST
          treeGrid.slice(gY + 1).map(r => r[gX]),           // SOUTH
          treeGrid[gY].slice(0, gX).reverse()               // WEST
        ]

        const treeScenicScore = neswTrees.reduce((memo, next) => {
          return memo * getViewingDistance(treeHeight, next)
        }, 1)

        scoredTrees.push({ x: gX, y: gY, score: treeScenicScore })
      }
    }
  }

  scoredTrees.sort((a, b) => b.score - a.score)
  const bestTree = scoredTrees[0]

  console.log(`the highest scenic score is ${bestTree.score} for tree ${bestTree.x},${bestTree.y}`)
}

main()
  .catch(console.error)
