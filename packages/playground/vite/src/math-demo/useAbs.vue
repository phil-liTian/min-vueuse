<template>
  <div>useAbs: {{ value }}</div>
</template>
  
<script lang='ts' setup>
  import { useAbs } from '@mini-vueuse/math'
  const value = useAbs(-1.2)
</script>
  
<style lang='less' scoped>
  
</style>