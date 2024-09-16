<template>
  <div>reactify: {{ c }}</div>
</template>
  
<script lang='ts' setup>
  import { reactify } from '@mini-vueuse/core'
  import { ref } from 'vue';

  const add = reactify((a: number, b: number) => a + b)

  const a = ref(3)
  const b = ref(4)

  const c = add(a, () => b.value)
  
</script>
  
<style lang='less' scoped>
  
</style>