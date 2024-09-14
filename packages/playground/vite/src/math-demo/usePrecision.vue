<template>
  <div>usePrecision: {{ showValue }}</div>
</template>
  
<script lang='ts' setup>
  import { usePrecision } from '@mini-vueuse/math'
  const showValue = usePrecision(2.3, 2)
</script>
  
<style lang='less' scoped>
  
</style>