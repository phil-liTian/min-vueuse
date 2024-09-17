<template>
  <div>usePageLeave: {{ isLeft }}</div>
</template>
  
<script lang='ts' setup>
  import { usePageLeave } from '@mini-vueuse/core'

  const isLeft = usePageLeave()
</script>
  
<style lang='less' scoped>
  
</style>