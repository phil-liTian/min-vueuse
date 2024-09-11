<template>
  <div>
    <span>useNow: {{ now }}</span>
    <button @click="pause">pause</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useNow } from '@mini-vueuse/core'
  const { now, pause, resume } = useNow({ controls: true })
</script>
  
<style lang='less' scoped>
  
</style>