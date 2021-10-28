<template>
  <h2>Input</h2>
  <input
    v-model="
      /* eslint-disable vue/no-mutating-props */ url"
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
  methods: {
    start () {
      this.$emit('start', this.url)
    }
  }
}
</script>

<style scoped>

</style>
