<template>
  <div>
    <p>useEventBusSib</p>
    <button @click="emit('inc', 1)">changeEventCount</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useEventBus } from '@mini-vueuse/core';

  const { emit } = useEventBus<'inc' | 'dec', number>('bus')
</script>
  
<style lang='less' scoped>
  
</style>