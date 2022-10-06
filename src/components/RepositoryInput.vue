<template>
  <h2>Input</h2>
  <input
    v-model="repoUrl"
    type="url"
    size="60"
  >
  <button @click="start">
    Go
  </button>
</template>

<script>
export default {
  name: 'RepositoryInput',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  emits: ['start'],
  data () {
    return {
      repoUrl: this.url // only need to duplicate this prop to data to avoid 'vue/no-mutating-props' linting error
    }
  },
  methods: {
    start () {
      this.$emit('start', this.repoUrl)
    }
  }
}
</script>

<style scoped>

</style>
