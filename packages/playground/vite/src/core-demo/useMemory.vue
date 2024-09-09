<template>
  <div>
    <span>used: {{ size(memory?.usedJSHeapSize) }}; 
      Allocated: {{ size(memory?.totalJSHeapSize) }};
      total: {{ size(memory?.jsHeapSizeLimit) }}
    </span>
  </div>
</template>
  
<script lang='ts' setup>
  import { useMemory } from '@mini-vueuse/core'
  const { isSupported, memory } = useMemory()
  function size(v): string {
    const kb = v / 1024 / 1024
    return `${kb.toFixed(2)} MB`
  }
  
</script>
  
<style lang='less' scoped>
  
</style>