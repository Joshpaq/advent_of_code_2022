const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')
const { default: test } = require('node:test')

const NUM_ROUNDS = 10000

const newMonkeyPattern = /^Monkey/
const startingItemsPattern = /Starting items/
const operationPattern = /Operation/
const testPattern = /Test/
const ifTruePattern = /If true/
const ifFalsePattern = /If false/

function doOperation (old, ops) {
  let [left, operation, right] = ops
  left = left === 'old' ? old : parseInt(left)
  right = right === 'old' ? old : parseInt(right)

  let result
  switch (operation) {
    case '+':
      result = left + right
      break
    case '*':
      result = left * right
      break
    default:
      throw new Error('unknown operation')
  }
  
  return result
}

async function main () {
  const monkeys = []

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    if (newMonkeyPattern.test(line)) {
      const number = parseInt(line.match(/\d+/)[0])
      monkeys.push({ number, items: [], ops: null, test: null, ifTrue: null, ifFalse: null, itemsInspected: 0 })
    } else if (startingItemsPattern.test(line)) {
      const [, items] = line.split(':')
      monkeys[monkeys.length - 1].items = items.split(',').map(n => parseInt(n.trim()))
    } else if (operationPattern.test(line)) {
      const [, operations] = line.split('=')
      monkeys[monkeys.length - 1].ops = operations.trim().split(' ')
    } else if (testPattern.test(line)) {
      monkeys[monkeys.length - 1].test = parseInt(line.match(/\d+/)[0])
    } else if (ifTruePattern.test(line)) {
      monkeys[monkeys.length - 1].ifTrue = parseInt(line.match(/\d+/)[0])
    } else if (ifFalsePattern.test(line)) {
      monkeys[monkeys.length - 1].ifFalse = parseInt(line.match(/\d+/)[0])
    } 
  })
  
  await events.once(inputLineReader, 'close')

  const superMod = monkeys.reduce((memo, next) => {
    return memo * next.test
  }, 1)
  
  for (let round = 1; round <= NUM_ROUNDS; round ++) {
    monkeys.forEach(monkey => {
      while (monkey.items.length !== 0) {
        monkey.itemsInspected++
        const [item] = monkey.items.splice(0, 1)
        const newWorry = doOperation(item, monkey.ops) % superMod
        if (newWorry % monkey.test === 0) {
          monkeys[monkey.ifTrue].items.push(newWorry)
        } else {
          monkeys[monkey.ifFalse].items.push(newWorry)
        }
      }
    })
  }

  const monkeyBusiness = monkeys.map(monkey => monkey.itemsInspected).sort((a, b) => b - a)

  console.log(`the level of monkey businesses is: ${monkeyBusiness[0] * monkeyBusiness[1]}`)
}

main()
  .catch(console.error)