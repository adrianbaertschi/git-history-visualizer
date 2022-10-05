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
  <Progress
    v-bind="progress"
  />
</template>

<script lang="ts">

import Log from './Log.vue'
import Progress from './Progress.vue'
import { FileChange, GitRepo } from '../git/git-client'
import http from 'isomorphic-git/http/web'
import { defineComponent } from 'vue'
import { parseCommit } from '../d3/tree-builder'
import { ForceDirectedGraph } from '../d3/force-directed-graph'
import Stats from './Stats.vue'
import RepositoryInput from './RepositoryInput.vue'
import * as LightningFS from '@isomorphic-git/lightning-fs'
import { FSBackend } from '@isomorphic-git/lightning-fs'
import { GitProgressEvent } from 'isomorphic-git'

export default defineComponent({
  components: {
    Stats,
    Log,
    RepositoryInput,
    Progress
  },
  data () {
    return {
      fileChangeLog: [] as FileChange[],
      repoUrl: 'https://github.com/adrianbaertschi/mars-rover' as String,
      progress: undefined as unknown as GitProgressEvent
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

      const updateProgress = (event: GitProgressEvent) => {
        this.progress = event
      }

      const repo = await new GitRepo(fs, http, undefined, updateProgress).clone(url)
      const commits = await repo.log()
      this.fileChangeLog = []
      this.fileChangeLog.unshift(...commits[0].files)

      this.progress.total = commits.map(value => value.files.length).reduce((a, b) => a + b, 0) - commits[0].files.length
      this.progress.loaded = 0
      this.progress.phase = 'Walking through commits'

      const initialTree = parseCommit(commits[0])
      const graph = new ForceDirectedGraph(initialTree)
      for (let i = 1; i < commits.length; i++) {
        const commit = commits[i]
        for (const file of commit.files) {
          this.fileChangeLog.unshift(file)
          this.progress.loaded++
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
