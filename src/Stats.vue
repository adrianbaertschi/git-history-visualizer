<template>
  <h2>Stats</h2>
  <ul>
    <li
      v-for="entry in numberOfFilesPerType"
      :key="entry.extension"
    >
      {{ entry.extension }}: {{ entry.count }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FileChange } from './git/git-client'

interface Occurrence {
  extension: string,
  count: number
}

export default defineComponent({
  name: 'Stats',
  props: {
    fileChanges: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    numberOfFilesPerType (): Occurrence[] {
      const changes = this.fileChanges as FileChange[]
      const sums = changes.filter(f => !f.isDirectory).reduce(
        (acc: Map<string, number>, file: FileChange) => {
          const extension = file.path.split('.').pop() ?? 'unknown'
          const current = acc.get(extension) ?? 0
          if (file.operation === 'ADD') {
            acc.set(extension, current + 1)
          } else if (file.operation === 'REMOVE') {
            acc.set(extension, current - 1)
          }
          return acc
        },
        new Map()
      )

      return Array.from(sums, ([extension, count]) => ({
        extension,
        count
      })).sort((a, b) => b.count - a.count)
    }
  }
})
</script>

<style scoped>

</style>
