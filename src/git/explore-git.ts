import {WalkerEntry} from "isomorphic-git";

const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const fs = require('fs')

export const getChanges = async () => {
    const dir = path.join(process.cwd(), 'test-clone')
    await git.clone({
        fs, http, dir, url: 'https://github.com/adrianbaertschi/mars-rover'
    })
    let commits = await git.log({fs, dir});
    commits.reverse();

    let firstCommit = commits[0];
    const filesOfFirsCommit = (await git.listFiles(
        {fs, dir: dir, ref: firstCommit.oid}
    )).map((filepath: string) => ({
        path: filepath,
        type: 'add',
    }));

    const result = [];
    result.push({
        commit: firstCommit.oid,
        files: filesOfFirsCommit
    })

    for (let i = 0; i < commits.length - 1; i++) {
        const currentCommit = commits[i];
        const nextCommit = commits[i + 1];
        const files = await getFileStateChanges(currentCommit.oid, nextCommit.oid, dir);
        result.push({commit: nextCommit.oid, files: files})
    }

    for (const resultElement of result) {
        console.log(resultElement)
    }
    return result;
}

// https://isomorphic-git.org/docs/en/snippets
async function getFileStateChanges(commitHash1: string, commitHash2: string, dir: any) {
    return git.walk({
        fs,
        dir,
        trees: [git.TREE({ref: commitHash1}), git.TREE({ref: commitHash2})],
        map: async function (filepath: string, [A, B]: WalkerEntry[]) {
            // ignore directories
            if (filepath === '.') {
                return
            }
            if (A == null) {
                // console.log('A is null')
                return
            }

            if (B == null) {
                // console.log('A is null')
                return
            }

            if ((await A.type()) === 'tree' || (await B.type()) === 'tree') {
                return
            }

            // generate ids
            const Aoid = await A.oid()
            const Boid = await B.oid()

            // determine modification type
            let type = 'equal'
            if (Aoid !== Boid) {
                type = 'modify'
            }
            if (Aoid === undefined) {
                type = 'add'
            }
            if (Boid === undefined) {
                type = 'remove'
            }

            if (type === 'equal') {
                return
            }
            if (Aoid === undefined && Boid === undefined) {
                console.log('Something weird happened:')
                console.log(A)
                console.log(B)
            }

            return {
                path: filepath,
                type: type,
            }
        },
    })
}


getChanges().then(() => console.log('Done'))