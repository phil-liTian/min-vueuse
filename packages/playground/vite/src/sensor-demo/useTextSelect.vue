<template>
  <div>useTextSelect: {{ text }} {{ ranges }} 
    <p>select rects</p>
    <pre>{{ rects }}</pre>
  </div>
</template>
  
<script lang='ts' setup>
  import { useTextSelection } from '@mini-vueuse/core'
  const { text, ranges, rects } = useTextSelection()
  
</script>
  
<style lang='less' scoped>
  
</style>