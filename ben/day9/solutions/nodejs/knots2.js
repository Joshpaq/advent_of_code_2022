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
  visitedPositions.add('0,0')

  const rope = [...Array(10)].map(i => ({ x: 0, y: 0 }))

  for (const move of moves) {
    const [direction, count] = move.split(' ')
    for (let m = 0; m < count; m++) {
      console.log(`move ${direction}`)

      switch (direction) {
        case 'U':
          rope[0].y++
          break
        case 'D':
          rope[0].y--
          break
        case 'L':
          rope[0].x--
          break
        case 'R':
          rope[0].x++
          break
      }

      const lastMove = rope.reduce((memo, next, node) => {
        const xDelta = Math.abs(memo.x - next.x)
        const yDelta = Math.abs(memo.y - next.y)

        if (xDelta > 1 && yDelta > 1) { // diagonal move, move to next position
          memo.x > next.x ? next.x++ : next.x-- 
          memo.y > next.y ? next.y++ : next.y--
        } else if (xDelta > 1) { // lateral move, snap to Y
          next.y = memo.y
          memo.x > next.x ? next.x++ : next.x-- 
        } else if (yDelta > 1) { // vertical move, snap to X
          next.x = memo.x
          memo.y > next.y ? next.y++ : next.y--
        }

        console.log(`${node} at ${next.x},${next.y}`)
        return next
      }, rope[0])

      visitedPositions.add(`${lastMove.x},${lastMove.y}`)
    } 
  }

  console.log(`the tail visited ${visitedPositions.size} positions`)
}

main()
  .catch(console.error)
