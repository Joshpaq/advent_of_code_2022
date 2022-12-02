const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')


async function main () {
  const elves = []
  let currentElf = 0

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    if (line === '') {
      elves.push(currentElf)
      currentElf = 0
    } else {
      currentElf = currentElf + Number.parseInt(line)
    }
  })
  
  await events.once(inputLineReader, 'close')

  const elvesSorted = elves.sort((a, b) => b -a)
  console.log(`the Elf carrying the most calories is: ${elvesSorted[0]}`)
  console.log(`the top three Elves are carrying: ${elvesSorted.slice(0, 3).reduce((memo, next) => memo + next, 0)}`)
}

main()
  .catch(console.error)