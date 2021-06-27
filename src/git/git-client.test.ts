import { Commit, GitRepo } from './git-client'
import * as fs from 'fs'
import * as http from 'isomorphic-git/http/node'
import * as path from 'path'

let changes: Commit[]
beforeAll(async () => {
  const dir = path.join(process.cwd(), 'test-clone')
  const repo = await new GitRepo(fs, http, dir).clone('https://github.com/adrianbaertschi/mars-rover')
  changes = await repo.log()
})

test('mars-rover repo has 5 commits', async () => {
  expect(changes.length).toBe(5)
})

test('mars-rover repo first commit lists files', async () => {
  const firstCommit = changes[0]
  expect(firstCommit.commit).toBe('1c416b90e6dffb31ea657976be5961fb04d1c5fc')
  const expectedFiles = [
    {
      path: '.gitignore',
      operation: 'ADD'
    },
    {
      path: 'README.md',
      operation: 'ADD'
    },
    {
      path: 'build.gradle',
      operation: 'ADD'
    },
    {
      path: 'gradle/wrapper/gradle-wrapper.jar',
      operation: 'ADD'
    },
    {
      path: 'gradle/wrapper/gradle-wrapper.properties',
      operation: 'ADD'
    },
    {
      path: 'gradlew',
      operation: 'ADD'
    },
    {
      path: 'gradlew.bat',
      operation: 'ADD'
    },
    {
      path: 'settings.gradle',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/Direction.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/Plateau.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/Rover.java',
      operation: 'ADD'
    },
    {
      path: 'src/test/java/PlateauTest.java',
      operation: 'ADD'
    },
    {
      path: 'src/test/java/RoverTest.java',
      operation: 'ADD'
    }
  ]
  expect(firstCommit.files).toStrictEqual(expectedFiles)
})

test('mars-rover repo list files of commit two and three', async () => {
  expect(changes[1]).toStrictEqual({
    commit: '7142a1bbf3bfd01e5d00f36cd1ab7f1b45542253',
    files: [{
      path: '.gitignore',
      operation: 'MODIFY'
    }]
  })

  expect(changes[2]).toStrictEqual({
    commit: '3e8d01a9bf157aa9c1aad6688a25b0d302e7826c',
    files: [{
      path: 'build.gradle',
      operation: 'MODIFY'
    }]
  })
})

test('mars-rover repo list file and folder renaming', async () => {
  const commit = changes[3]
  expect(commit.commit).toBe('1f24518841540a89e795719c52a917821a864488')
  const expectedFiles = [
    {
      path: 'build.gradle',
      operation: 'MODIFY'
    },
    {
      path: 'src/main/java/Direction.java',
      operation: 'REMOVE'
    },
    {
      path: 'src/main/java/Plateau.java',
      operation: 'REMOVE'
    },
    {
      path: 'src/main/java/Rover.java',
      operation: 'REMOVE'
    },
    {
      path: 'src/main/java/marsrover',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/Direction.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/Plateau.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/Rover.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/instruction',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/instruction/Instruction.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/instruction/InstructionParser.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/instruction/LeftInstruction.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/instruction/MoveInstruction.java',
      operation: 'ADD'
    },
    {
      path: 'src/main/java/marsrover/instruction/RightInstruction.java',
      operation: 'ADD'
    },
    {
      path: 'src/test/java/PlateauTest.java',
      operation: 'REMOVE'
    },
    {
      path: 'src/test/java/RoverTest.java',
      operation: 'REMOVE'
    },
    {
      path: 'src/test/java/marsrover',
      operation: 'ADD'
    },
    {
      path: 'src/test/java/marsrover/PlateauTest.java',
      operation: 'ADD'
    },
    {
      path: 'src/test/java/marsrover/RoverTest.java',
      operation: 'ADD'
    },
    {
      path: 'src/test/java/marsrover/instruction',
      operation: 'ADD'
    },
    {
      path: 'src/test/java/marsrover/instruction/InstructionParserTest.java',
      operation: 'ADD'
    }
  ]
  expect(commit.files).toStrictEqual(expectedFiles)
})
