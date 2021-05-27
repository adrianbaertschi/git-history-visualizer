const path = require('path')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')
const fs = require('fs')

const run = async () => {
    const dir = path.join(process.cwd(), 'test-clone')
    await git.clone({
        fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs'
    }).then(console.log)
    let readCommitResults = await git.log({fs, dir});
    console.log('log', readCommitResults)
}

run().then(() => console.log('Done'))