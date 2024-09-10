<template>
  <div>useCeil: {{ value }}</div>
</template>
  
<script lang='ts' setup>
  import { useCeil } from '@mini-vueuse/math'
  const value = useCeil(1.2)
</script>
  
<style lang='less' scoped>
  
</style>