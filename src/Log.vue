<template>
  <div id="console">
    <div
      v-for="change in changes"
      :key="change.commit"
    >
      {{ change }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Log',
  props: {
    changes: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
#console {
  overflow-y: scroll;
  height: 250px;
  font-family: Consolas, monospace
}
</style>
