<template>
  <h2>Progress</h2>
  <div v-if="total">
    {{ phase }} {{ Math.round(loaded / total * 100) }}%
  </div>
  <div v-else>
    {{ phase }} {{ loaded }}
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    phase: {
      type: String,
      default: ''
    },
    loaded: {
      type: Number,
      default: undefined
    },
    total: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>

</style>
