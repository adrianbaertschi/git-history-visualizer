import {Commit, getChanges} from "./git-client";
import * as fs from "fs";
import * as http from 'isomorphic-git/http/node'
import * as path from 'path'


let changes: Commit[];
beforeAll(async () => {
    const dir = path.join(process.cwd(), 'test-clone')
    changes = await getChanges(fs, http, dir);
});

test('mars-rover repo has 5 commits', async () => {
    expect(changes.length).toBe(5)
})

test('mars-rover repo first commit lists files', async () => {
    const firstCommit = changes[0];
    expect(firstCommit.commit).toBe('1c416b90e6dffb31ea657976be5961fb04d1c5fc')
    const expectedFiles = [
        {path: ".gitignore", type: "add"},
        {path: "README.md", type: "add"},
        {path: "build.gradle", type: "add"},
        {path: "gradle/wrapper/gradle-wrapper.jar", type: "add"},
        {path: "gradle/wrapper/gradle-wrapper.properties", type: "add"},
        {path: "gradlew", type: "add"},
        {path: "gradlew.bat", type: "add"},
        {path: "settings.gradle", type: "add"},
        {path: "src/main/java/Direction.java", type: "add"},
        {path: "src/main/java/Plateau.java", type: "add"},
        {path: "src/main/java/Rover.java", type: "add"},
        {path: "src/test/java/PlateauTest.java", type: "add"},
        {path: "src/test/java/RoverTest.java", type: "add"}
    ]
    expect(firstCommit.files).toStrictEqual(expectedFiles);
})

test('mars-rover repo list files of commit two and three', async () => {
    expect(changes[1]).toStrictEqual({
        commit: '7142a1bbf3bfd01e5d00f36cd1ab7f1b45542253',
        files: [{path: ".gitignore", type: "modify"}]
    });

    expect(changes[2]).toStrictEqual({
        commit: '3e8d01a9bf157aa9c1aad6688a25b0d302e7826c',
        files: [{path: "build.gradle", type: "modify"}]
    });
})

test('mars-rover repo list file and folder renaming', async () => {
    const commit = changes[3];
    expect(commit.commit).toBe('1f24518841540a89e795719c52a917821a864488')
    const expectedFiles = [
        {path: "build.gradle", type: "modify"},
        {path: 'src/main/java/Direction.java', type: 'delete'},
        {path: 'src/main/java/Plateau.java', type: 'delete'},
        {path: 'src/main/java/Rover.java', type: 'delete'},
        {path: 'src/main/java/marsrover', type: 'add'},
        {path: 'src/main/java/marsrover/Direction.java', type: 'add'},
        {path: 'src/main/java/marsrover/Plateau.java', type: 'add'},
        {path: 'src/main/java/marsrover/Rover.java', type: 'add'},
        {path: 'src/main/java/marsrover/instruction', type: 'add'},
        {path: 'src/main/java/marsrover/instruction/Instruction.java', type: 'add'},
        {path: 'src/main/java/marsrover/instruction/InstructionParser.java', type: 'add'},
        {path: 'src/main/java/marsrover/instruction/LeftInstruction.java', type: 'add'},
        {path: 'src/main/java/marsrover/instruction/MoveInstruction.java', type: 'add'},
        {path: 'src/main/java/marsrover/instruction/RightInstruction.java', type: 'add'},
        {path: 'src/test/java/PlateauTest.java', type: 'delete'},
        {path: 'src/test/java/RoverTest.java', type: 'delete'},
        {path: 'src/test/java/marsrover', type: 'add'},
        {path: 'src/test/java/marsrover/PlateauTest.java', type: 'add'},
        {path: 'src/test/java/marsrover/RoverTest.java', type: 'add'},
        {path: 'src/test/java/marsrover/instruction', type: 'add'},
        {path: 'src/test/java/marsrover/instruction/InstructionParserTest.java', type: 'add'}
    ]
    expect(commit.files).toStrictEqual(expectedFiles);
})