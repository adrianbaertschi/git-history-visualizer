import { ForceDirectedGraph } from './d3/force-directed-graph'
import { GitRepo } from './git/git-client'
import * as LightningFS from '@isomorphic-git/lightning-fs'
import http from 'isomorphic-git/http/web'
import { parseCommit } from './d3/tree-builder'
import { createApp } from 'vue'
import App from './App.vue'

(async function () {
  createApp(App).mount('#app')

  const fs = new LightningFS('fs')
  const repo = await new GitRepo(fs, http).clone('https://github.com/adrianbaertschi/mars-rover')
  const commits = await repo.log()

  const initialTree = parseCommit(commits[0])
  const graph = new ForceDirectedGraph(initialTree)
  for (let i = 1; i < commits.length; i++) {
    const commit = commits[i]
    console.log('Commit id ', commit.commit)

    for (const file of commit.files) {
      console.log(file.operation, file.path)
      await new Promise(resolve => setTimeout(resolve, 500))

      switch (file.operation) {
        case 'ADD':
          graph.addNode(`root/${file.path}`)
          break
        case 'REMOVE':
          graph.remove(`root/${file.path}`)
          break
        case 'MODIFY':
          graph.modify(`root/${file.path}`)
          break
      }
    }
  }
})().then(
  () => {
  },
  () => {
  }
)
