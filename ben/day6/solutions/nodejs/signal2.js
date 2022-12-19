const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

async function main () {
  let signal
  let signalFound = false

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    signal = line.split('')
  })

  await events.once(inputLineReader, 'close')

  const processedSignal = signal.splice(0, 14)

  while (!signalFound) {
    const head = processedSignal.slice(-14)
    const mappedHead = head.reduce((memo, next) => {
      if (!memo[next]) {
        memo[next] = true
      } 
      return memo
    }, {})

    if (Object.keys(mappedHead).length === 14) {
      signalFound = true
    } else {
      processedSignal.push(signal.shift())
    }
  }

  console.log(`signal detected after ${processedSignal.length} characters`)
}

main()
  .catch(console.error)
