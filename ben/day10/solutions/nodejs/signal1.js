const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

const FIRST_CYCLE = 20
const EVERY_CYCLE_AFTER = 40

let cycles = 0
let x = 1
const signals = []

function nextCycle(value = 0) {
  cycles++
  if (cycles === FIRST_CYCLE) {
    signals.push(x * cycles)    
  } else if (cycles > FIRST_CYCLE && (cycles - FIRST_CYCLE) % EVERY_CYCLE_AFTER === 0) {
    signals.push(x * cycles)
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

  const totalStrength = signals.reduce((memo, next) => {
    return memo + next
  }, 0)

  console.log(`the sum of the six signal strengths is: ${totalStrength}`)
}

main()
  .catch(console.error)