import { ForceDirectedGraph } from './d3/force-directed-graph'
import { FileOperation, getChanges } from './git/git-client'
import * as LightningFS from '@isomorphic-git/lightning-fs'
import http from 'isomorphic-git/http/web'
import { parseCommit } from './d3/tree-builder'

(async function () {
  const fs = new LightningFS('fs')
  const commits = await getChanges(fs, http)

  const initialTree = parseCommit(commits[0])

  const graph = new ForceDirectedGraph(initialTree)
  for (let i = 1; i < commits.length; i++) {
    const commit = commits[i]
    console.log('Commit id ', commit.commit)

    for (const file of commit.files) {
      console.log(file.operation, file.path)
      await new Promise(r => setTimeout(r, 500))

      switch (file.operation) {
        case FileOperation.ADD:
          graph.addNode(`root/${file.path}`)
          break
        case FileOperation.REMOVE:
          graph.remove(`root/${file.path}`)
          break
        case FileOperation.MODIFY:
          graph.modify(`root/${file.path}`)
          break
      }
    }
  }
})()
