const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

async function main () {
  const moves = []
  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    moves.push(line)
  })
  
  await events.once(inputLineReader, 'close')
  
  const visitedPositions = new Set()
  visitedPositions.add('0-0')

  const headPos = { x: 0, y: 0 }
  const tailPos = { x: 0, y: 0 }
  const nextPos = { x: 0, y: 0 }

  for (const move of moves) {
    const [direction, count] = move.split(' ')
    for (let m = 0; m < count; m++) {
      switch (direction) {
        case 'U':
          nextPos.y = headPos.y + 1
          break
        case 'D':
          nextPos.y = headPos.y - 1
          break
        case 'L':
          nextPos.x = headPos.x - 1
          break
        case 'R':
          nextPos.x = headPos.x + 1
          break
      }

      if (Math.abs(nextPos.x - tailPos.x) > 1 || Math.abs(nextPos.y - tailPos.y) > 1) {
        // tail moves to head position, mark position as visited
        tailPos.x = headPos.x
        tailPos.y = headPos.y
        visitedPositions.add(`${tailPos.x},${tailPos.y}`)
      }

      headPos.x = nextPos.x
      headPos.y = nextPos.y
    } 
  }

  console.log(`the tail visited ${visitedPositions.size} positions`)
}

main()
  .catch(console.error)