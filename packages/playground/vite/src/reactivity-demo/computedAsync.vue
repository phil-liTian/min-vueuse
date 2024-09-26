<template>
  <div>
    <p>computedAsync</p>
    <span>data: {{ data }}</span>
  </div>
</template>
  
<script lang='ts' setup>
  import { computedAsync } from '@mini-vueuse/core'
  import { ref } from 'vue';

  const fn = () => {
    return 'fn'
  }

  // const data = computedAsync(fn, undefined, { lazy: true })

  const evaluating = ref(false)
  const a = computedAsync(fn, null, evaluating)
</script>
  
<style lang='less' scoped>
  
</style>