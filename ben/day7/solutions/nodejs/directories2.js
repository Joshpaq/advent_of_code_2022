const path = require('path')
const { createReadStream } = require('fs')
const readline = require('readline')
const events = require('events')

const TOTAL_DISK_SPACE = 70000000
const TARGET_UNUSED_SPACE = 30000000

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

  const root = filesystem.get('root')
  console.log(`total file system usage: ${root.filesize + root.childDirsSize}`)
  console.log(`target file system usage: ${TOTAL_DISK_SPACE - TARGET_UNUSED_SPACE}`)

  const bytesDelta = (root.filesize + root.childDirsSize) - (TOTAL_DISK_SPACE - TARGET_UNUSED_SPACE)
  console.log(`bytes needed to free: ${bytesDelta}`)

  const deleteCandidates = Array.from(filesystem.values())
    .filter((d) => {
      return (d.filesize + d.childDirsSize) > bytesDelta
    })
    .sort((a, b) => {
      return (a.filesize + a.childDirsSize) - (b.filesize + b.childDirsSize)
    })
  
  const smallestDeleteCandidate = deleteCandidates[0]
  console.log(`the smallest directory to free at least: ${bytesDelta} bytes is ${smallestDeleteCandidate.path} with ${smallestDeleteCandidate.filesize + smallestDeleteCandidate.childDirsSize} bytes`)
}

main()
  .catch(console.error)
