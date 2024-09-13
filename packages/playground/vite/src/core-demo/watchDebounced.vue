<template>
  <div>
    <span>watchDebounced: {{ num }}</span>
    <button @click="num++">add</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { watchDebounced } from '@mini-vueuse/shared'
  import { ref } from 'vue';
  const num = ref(1)
  watchDebounced(num, () => {
    console.log('a');
  }, { debounce: 1000 })
</script>
  
<style lang='less' scoped>
  
</style>