<template>
  <div class="grid gap-2">
    <p>useKeyModifier: {{ alt }}</p>
    <Key :value="control">Control</Key>
    <Key :value="numLock">NumLock</Key>
    <Key :value="shift">Shift</Key>
    <Key :value="alt">Alt</Key>
  </div>
</template>
  
<script lang='ts' setup>
  import { useKeyModifier } from '@mini-vueuse/core'
  import Key from './components/key.vue'
  const alt = useKeyModifier('Alt')

  const control = useKeyModifier('Control')
  const numLock = useKeyModifier('NumLock')
  const shift = useKeyModifier('Shift')
  
</script>
  
<style lang='less' scoped>
  
</style>