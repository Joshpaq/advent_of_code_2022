const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

/*
NOTES

A, X Rock     1
B, Y Paper    2
C, Z Sissors  3

0 loss
3 draw
6 win
*/

const outcomes = {
  'A X': 'T',
  'A Y': 'W',
  'A Z': 'L',
  'B X': 'L',
  'B Y': 'T',
  'B Z': 'W',
  'C X': 'W',
  'C Y': 'L',
  'C Z': 'T'
}

const throwValues = {
  'A': 1,
  'B': 2,
  'C': 3,
  'X': 1,
  'Y': 2,
  'Z': 3
}

async function main () {
  let myScore = 0
  let oppScore = 0

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    let [oppRoundScore, myRoundScore] = line.split(' ').map((t) => throwValues[t])

    switch(outcomes[line]) {
      case 'T':
        myRoundScore += 3
        oppRoundScore += 3
        break
      case 'W':
        myRoundScore += 6
        break
      case 'L':
        oppRoundScore += 6
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