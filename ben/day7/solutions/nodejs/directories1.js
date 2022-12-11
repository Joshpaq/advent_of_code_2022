const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

async function main () {
  let cd = {path: '', parent: '', filesize: 0, childDirs: [], childDirsSize: 0 }
  const filesystem = new Map()

  const inputLineReader = readline.createInterface({
    input: createReadStream(path.resolve(process.argv[2]), 'utf-8')
  })

  inputLineReader.on('line', (line) => {
    if (line.startsWith('$ cd')) {
      const newCdPath = line.substring(5)
      if (newCdPath === '..') { // moving up
        cd = filesystem.get(cd.parent)
      } else { // moving down
        const dirName = line.substring(5)
        const newCd = { 
          path: dirName === '/' ? 'root' : cd.path + '/' + dirName, // it's a lot quicker to rename / to root than to deal with it otherwise
          parent: cd.path, 
          filesize: 0, 
          childDirs: [], 
          childDirsSize: 0 
        }
        filesystem.set(newCd.path, newCd)
        cd = newCd
      }
    } else if (line === '$ ls') {
      // do nothing
    } else if (line.startsWith('dir')) {
      filesystem.get(cd.path).childDirs.push(cd.path + '/' + line.substring(4))
    } else {
      const [size] = line.match(/\d+/) 
      filesystem.get(cd.path).filesize += parseInt(size)
    }
  })

  await events.once(inputLineReader, 'close')

  // This will create an array that is a flattened hierarchy of directories, I can use this to calculate the sizes w/o recursion
  const dirsToProcess = ['root'] // I could filter for which directory has parent === null but w/e
  const dirsHierarchy = []
  while (dirsToProcess.length > 0) {
    const processingDirPath = dirsToProcess.shift()
    dirsHierarchy.push(processingDirPath)

    for (const childDirPath of filesystem.get(processingDirPath).childDirs) {
      dirsToProcess.push(childDirPath)
    }
  }

  for (const dirPath of dirsHierarchy.reverse()) {
    const dir = filesystem.get(dirPath)
    dir.childDirsSize = dir.childDirs.reduce((memo, next) => {
      const childDir = filesystem.get(next)
      memo += (childDir.filesize + childDir.childDirsSize)
      return memo
    }, 0)
  }

  const smallDirectoriesTotalSize = Array.from(filesystem.values())
    .reduce((memo, next) => {
      const size = next.filesize + next.childDirsSize
      if (size < 100000) {
        memo += size
      }
      return memo
    }, 0)

  console.log(`sum of sizes of directories: ${smallDirectoriesTotalSize}`)
}

main()
  .catch(console.error)