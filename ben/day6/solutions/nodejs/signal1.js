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

  const processedSignal = signal.splice(0, 4)

  while (!signalFound) {
    const [a, b, c, d] = processedSignal.slice(-4)
    if (a != b && a != c && a != d && b != c && b != d && c != d) {
      signalFound = true
    } else {
      processedSignal.push(signal.shift())
    }
  }

  console.log(`signal detected after ${processedSignal.length} characters`)
}

main()
  .catch(console.error)