const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

const CRT_WIDTH = 40

let cycles = 0
let x = 1
const crt = []

function nextCycle(value = 0) {
  cycles++
  const cyclePos = (cycles - 1) % CRT_WIDTH
  if (cyclePos >= (x - 1) && cyclePos <= (x + 1)) {
    crt.push('#')
  } else {
    crt.push('.')
  }
  x += parseInt(value)
}

async function main () {
  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    const [opp, value] = line.split(' ')
    if (opp === 'noop') {
      nextCycle()
    } else if (opp === 'addx') {
      nextCycle()
      nextCycle(value)
    }
  })
  
  await events.once(inputLineReader, 'close')

  while (crt.length > 0) {
    const buffer = crt.splice(0, 40)
    console.log(buffer.reduce((memo, next) => {
      return memo + next
    }, ''))
  }
}

main()
  .catch(console.error)
