<template>
  <div>useArrysEvery: {{  result  }}</div>
</template>
  
<script lang='ts' setup>
  import { useArrayEvery } from '@mini-vueuse/array'
  import { ref } from 'vue';

  const list = ref([0, 2, 4, 6, 8])
  const result = useArrayEvery(list, i => i % 2 === 0)
</script>
  
<style lang='less' scoped>
  
</style>