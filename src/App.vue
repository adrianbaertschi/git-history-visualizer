<template>
  <RepositoryInput
    :url="repoUrl"
    @start="start"
  />
  <Log
    :changes="fileChangeLog"
  />
  <Stats
    :file-changes="fileChangeLog"
  />
</template>

<script lang="ts">

import Log from './Log.vue'
import { FileChange, GitRepo } from './git/git-client'
import http from 'isomorphic-git/http/web'
import { defineComponent } from 'vue'
import { parseCommit } from './d3/tree-builder'
import { ForceDirectedGraph } from './d3/force-directed-graph'
import Stats from './Stats.vue'
import RepositoryInput from './RepositoryInput.vue'
import * as LightningFS from '@isomorphic-git/lightning-fs'
import { FSBackend } from '@isomorphic-git/lightning-fs'

export default defineComponent({
  components: {
    Stats,
    Log,
    RepositoryInput
  },
  data () {
    return {
      fileChangeLog: [] as FileChange[],
      repoUrl: 'https://github.com/adrianbaertschi/mars-rover' as String
    }
  },
  methods: {
    async start (url: string) {
      const fs = new LightningFS('fs', {
        backend: undefined as unknown as FSBackend,
        defer: false,
        fileDbName: '',
        fileStoreName: '',
        lockDbName: '',
        lockStoreName: '',
        url: '',
        urlauto: false,
        wipe: true
      })
      const repo = await new GitRepo(fs, http).clone(url)
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
  }
})

</script>

<style scoped>

</style>
