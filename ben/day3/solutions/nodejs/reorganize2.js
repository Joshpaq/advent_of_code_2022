const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')
const { group } = require('console')

const lettersByWeight = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

async function main () {
  let badgePrioritySum = 0
  let rucksacks = []

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    rucksacks.push(Array.from(line))
  })

  await events.once(inputLineReader, 'close')

  const groupedRucksacks = rucksacks.reduce((memo, next, index) => {
    if (index % 3 === 0) {
      memo.push([next])
    } else {
      memo[memo.length - 1].push(next)
    }

    return memo
  }, [])

  const prioritySum = groupedRucksacks.map((group) => {
    const badgeItem = group.reduce((memo, next) => {
      return memo.filter(x => next.includes(x))
    })[0]
    return lettersByWeight.indexOf(badgeItem) + 1
  }).
    reduce((memo, next) => {
      return memo += next
    }, 0)

  console.log(`the total badge priority is: ${prioritySum}`)
}

main()
  .catch(console.error)