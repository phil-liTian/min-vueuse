<template>
  <div>
    <span>refDebounce: {{ debouncedRef }}</span>
    <button @click="value++">add</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { refDebounce } from '@mini-vueuse/shared'
  import { ref } from 'vue';
  
  const value = ref(10)
  const debouncedRef = refDebounce(value, 1000)
</script>
  
<style lang='less' scoped>
  
</style>