<template>
  <div id="console">
    <div v-for="change in changes"> {{ change }}</div>
  </div>
</template>

<script>
export default {
  props: { changes: Array },
  name: 'Log',
}
</script>

<style scoped>
#console {
  overflow-y: scroll;
  height: 250px;
  font-family: Consolas, monospace
}
</style>
