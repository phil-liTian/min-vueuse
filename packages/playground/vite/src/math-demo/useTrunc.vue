<template>
  <div>useTrunc: {{ value }}</div>
</template>
  
<script lang='ts' setup>
  import { useTrunc } from '@mini-vueuse/math'
  const value = useTrunc(1.2)
</script>
  
<style lang='less' scoped>
  
</style>