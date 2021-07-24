<template>
  <Log v-bind:changes="commitLog"></Log>
</template>

<script lang="ts">

import Log from './Log.vue'
import * as LightningFS from '@isomorphic-git/lightning-fs'
import { GitRepo } from './git/git-client'
import http from 'isomorphic-git/http/web'
import { defineComponent } from 'vue'
import { parseCommit } from './d3/tree-builder'
import { ForceDirectedGraph } from './d3/force-directed-graph'

export default defineComponent({
  components: { Log },
  data () {
    return {
      message: 'Hello',
      commitLog: [] as string[]
    }
  },

  async mounted () {
    const fs = new LightningFS('fs')
    const repo = await new GitRepo(fs, http).clone('https://github.com/adrianbaertschi/mars-rover')
    const commits = await repo.log()
    this.commitLog = []

    const initialTree = parseCommit(commits[0])
    const graph = new ForceDirectedGraph(initialTree)
    for (let i = 1; i < commits.length; i++) {
      const commit = commits[i]
      this.commitLog.unshift(commit.commit)
      for (const file of commit.files) {
        this.commitLog.unshift(`${file.operation} ${file.path}`)
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
  }
})


</script>

<style scoped>

</style>
