<template>
  <div class="grid gap-2">
    <p>useMagicKeys: {{ u }}</p>
    <Key :value="u">u</Key>
    <Key :value="v">v</Key>
  </div>
</template>
  
<script lang='ts' setup>
  import { useMagicKeys } from '@mini-vueuse/core'
  import Key from './components/key.vue'
  const { u, v } = useMagicKeys()
  console.log('U', u);
  
</script>
  
<style lang='less' scoped>
  
</style>