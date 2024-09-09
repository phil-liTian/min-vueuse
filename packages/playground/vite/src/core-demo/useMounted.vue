<template>
  <div>isMounted: {{ isMounted }}</div>
</template>
  
<script lang='ts' setup>
  import { useMounted } from '@mini-vueuse/core'

  const isMounted = useMounted()
</script>
  
<style lang='less' scoped>
  
</style>