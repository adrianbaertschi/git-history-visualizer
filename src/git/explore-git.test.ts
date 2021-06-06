import {getChanges} from "./explore-git";
import * as fs from "fs";
import * as http from 'isomorphic-git/http/node'
import * as path from 'path'

const dir = path.join(process.cwd(), 'test-clone')

test('mars-rover repo has 5 commits', async () => {
    const changes = await getChanges(fs, http, dir);
    expect(changes.length).toBe(5)
})

test('mars-rover repo first commit lists files', async () => {
    const changes = await getChanges(fs, http, dir);
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