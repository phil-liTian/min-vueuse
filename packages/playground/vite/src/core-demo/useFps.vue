
<template>
  <div>useFps: {{ fps }}</div>
</template>
  
<script lang='ts' setup>
  import { useFps } from '@mini-vueuse/core'
  const fps = useFps({ every: 100 })
</script>
  
<style lang='less' scoped>
  
</style>
