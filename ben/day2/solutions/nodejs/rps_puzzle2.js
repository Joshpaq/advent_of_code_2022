const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

/*
NOTES

A Rock     1
B Paper    2
C Sissors  3

X 0 loss
Y 3 draw
Z 6 win
*/

const myThrowMap = {
  'A X': 'C',
  'A Y': 'A',
  'A Z': 'B',
  'B X': 'A',
  'B Y': 'B',
  'B Z': 'C',
  'C X': 'B',
  'C Y': 'C',
  'C Z': 'A'
}

const throwValues = {
  'A': 1,
  'B': 2,
  'C': 3
}

async function main () {
  let myScore = 0
  let oppScore = 0

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    const [oppThrow, outcome] = line.split(' ')
    const myThrow = myThrowMap[line]

    let myRoundScore = throwValues[myThrow]
    let oppRoundScore = throwValues[oppThrow]

    switch(outcome) {
      case 'X':
        oppRoundScore += 6
        break
      case 'Y':
        myRoundScore += 3
        oppRoundScore += 3
        break
      case 'Z':
        myRoundScore += 6
        break;
    }

    myScore += myRoundScore
    oppScore += oppRoundScore
  })
  
  await events.once(inputLineReader, 'close')

  console.log(`my score: ${myScore}`)
  console.log(`opponent score: ${oppScore}`)
}

main()
  .catch(console.error)