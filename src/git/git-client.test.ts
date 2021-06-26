import { Commit, FileOperation, getChanges } from './git-client'
import * as fs from 'fs'
import * as http from 'isomorphic-git/http/node'
import * as path from 'path'

let changes: Commit[]
beforeAll(async () => {
  const dir = path.join(process.cwd(), 'test-clone')
  changes = await getChanges(fs, http, dir)
})

test('mars-rover repo has 5 commits', async () => {
  expect(changes.length).toBe(5)
})

test('mars-rover repo first commit lists files', async () => {
  const firstCommit = changes[0]
  expect(firstCommit.commit).toBe('1c416b90e6dffb31ea657976be5961fb04d1c5fc')
  const expectedFiles = [
    { path: '.gitignore', operation: FileOperation.ADD },
    { path: 'README.md', operation: FileOperation.ADD },
    { path: 'build.gradle', operation: FileOperation.ADD },
    { path: 'gradle/wrapper/gradle-wrapper.jar', operation: FileOperation.ADD },
    { path: 'gradle/wrapper/gradle-wrapper.properties', operation: FileOperation.ADD },
    { path: 'gradlew', operation: FileOperation.ADD },
    { path: 'gradlew.bat', operation: FileOperation.ADD },
    { path: 'settings.gradle', operation: FileOperation.ADD },
    { path: 'src/main/java/Direction.java', operation: FileOperation.ADD },
    { path: 'src/main/java/Plateau.java', operation: FileOperation.ADD },
    { path: 'src/main/java/Rover.java', operation: FileOperation.ADD },
    { path: 'src/test/java/PlateauTest.java', operation: FileOperation.ADD },
    { path: 'src/test/java/RoverTest.java', operation: FileOperation.ADD }
  ]
  expect(firstCommit.files).toStrictEqual(expectedFiles)
})

test('mars-rover repo list files of commit two and three', async () => {
  expect(changes[1]).toStrictEqual({
    commit: '7142a1bbf3bfd01e5d00f36cd1ab7f1b45542253',
    files: [{ path: '.gitignore', operation: FileOperation.MODIFY }]
  })

  expect(changes[2]).toStrictEqual({
    commit: '3e8d01a9bf157aa9c1aad6688a25b0d302e7826c',
    files: [{ path: 'build.gradle', operation: FileOperation.MODIFY }]
  })
})

test('mars-rover repo list file and folder renaming', async () => {
  const commit = changes[3]
  expect(commit.commit).toBe('1f24518841540a89e795719c52a917821a864488')
  const expectedFiles = [
    { path: 'build.gradle', operation: FileOperation.MODIFY },
    { path: 'src/main/java/Direction.java', operation: FileOperation.REMOVE },
    { path: 'src/main/java/Plateau.java', operation: FileOperation.REMOVE },
    { path: 'src/main/java/Rover.java', operation: FileOperation.REMOVE },
    { path: 'src/main/java/marsrover', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/Direction.java', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/Plateau.java', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/Rover.java', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/instruction', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/instruction/Instruction.java', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/instruction/InstructionParser.java', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/instruction/LeftInstruction.java', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/instruction/MoveInstruction.java', operation: FileOperation.ADD },
    { path: 'src/main/java/marsrover/instruction/RightInstruction.java', operation: FileOperation.ADD },
    { path: 'src/test/java/PlateauTest.java', operation: FileOperation.REMOVE },
    { path: 'src/test/java/RoverTest.java', operation: FileOperation.REMOVE },
    { path: 'src/test/java/marsrover', operation: FileOperation.ADD },
    { path: 'src/test/java/marsrover/PlateauTest.java', operation: FileOperation.ADD },
    { path: 'src/test/java/marsrover/RoverTest.java', operation: FileOperation.ADD },
    { path: 'src/test/java/marsrover/instruction', operation: FileOperation.ADD },
    { path: 'src/test/java/marsrover/instruction/InstructionParserTest.java', operation: FileOperation.ADD }
  ]
  expect(commit.files).toStrictEqual(expectedFiles)
})
