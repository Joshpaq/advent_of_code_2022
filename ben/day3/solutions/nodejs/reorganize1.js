const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

const lettersByWeight = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

async function main () {
  let prioritySum = 0

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    const packA = Array.from(line.slice(0, line.length / 2))
    const packB = Array.from(line.slice(line.length / 2))
    const sharedItem = packA.filter(x => packB.includes(x))[0] // poor errorhandling w/e I trust the elves
    prioritySum += lettersByWeight.indexOf(sharedItem) + 1
  })
  
  await events.once(inputLineReader, 'close')

  console.log(`the total priority of shared items is: ${prioritySum}`)
}

main()
  .catch(console.error)