
const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

async function main () {
  let inputMode = 'STACKS'
  const stackLines = []

  const stacks = {}
  const moves = []

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    if (line === '') {
      inputMode = 'MOVES'
    } else {
      switch (inputMode) {
        case 'STACKS':
          stackLines.push(line)
          break
        case 'MOVES':
          moves.push(line)
          break
      }
    }
  })

  await events.once(inputLineReader, 'close')

  // make the stacks
  // reverse list, first line is keys
  stackLines.reverse()
  const stackKeys = stackLines
    .shift()
    .match(/.{1,4}/g)
    .map(t => t.trim())
  for (const key of stackKeys) {
    stacks[key] = []
  }
  
  for (const line of stackLines) {
    const cratesByPosition = line.match(/.{1,4}/g).map(c => c.replace(/\W/g, ''))
    cratesByPosition.forEach((c, i) => {
      if (c !== '') {
        stacks[stackKeys[i]].push(c)
      }
    })
  }

  for (const move of moves) {
    const [count, from, to] = move.match(/\d+/g)
    for (const crate of stacks[from].splice(-count)) {
      stacks[to].push(crate)
    }
  }

  const topCrates = stackKeys.reduce((memo, next) => {
    const stack = stacks[next]
    return memo + stack[stack.length - 1]
  }, '')
  console.log(`the top crates are: ${topCrates}`)
}

main()
  .catch(console.error)