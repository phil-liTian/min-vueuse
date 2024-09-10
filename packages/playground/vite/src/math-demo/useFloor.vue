<template>
  <div>useFloor: {{ value }}</div>
</template>
  
<script lang='ts' setup>
  import { useFloor } from '@mini-vueuse/math'
  const value = useFloor(1.2)
</script>
  
<style lang='less' scoped>
  
</style>