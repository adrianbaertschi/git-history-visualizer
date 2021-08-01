<template>
  <Log :changes="fileChangeLog" />
  <Stats :file-changes="fileChangeLog" />
</template>

<script lang="ts">

import Log from './Log.vue'
import * as LightningFS from '@isomorphic-git/lightning-fs'
import { FileChange, GitRepo } from './git/git-client'
import http from 'isomorphic-git/http/web'
import { defineComponent } from 'vue'
import { parseCommit } from './d3/tree-builder'
import { ForceDirectedGraph } from './d3/force-directed-graph'
import Stats from './Stats.vue'

export default defineComponent({
  components: {
    Stats,
    Log
  },
  data () {
    return {
      fileChangeLog: [] as FileChange[]
    }
  },

  async mounted () {
    const fs = new LightningFS('fs')
    const repo = await new GitRepo(fs, http).clone('https://github.com/adrianbaertschi/mars-rover')
    const commits = await repo.log()
    this.fileChangeLog = []
    this.fileChangeLog.unshift(...commits[0].files)

    const initialTree = parseCommit(commits[0])
    const graph = new ForceDirectedGraph(initialTree)
    for (let i = 1; i < commits.length; i++) {
      const commit = commits[i]
      for (const file of commit.files) {
        this.fileChangeLog.unshift(file)
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
