<template>
  <div>useEventBus: {{ counter }}</div>
</template>
  
<script lang='ts' setup>
  import { useEventBus } from '@mini-vueuse/core'
  import { useCounter } from '@mini-vueuse/shared';
  const counter = useCounter(1)
  const { on } = useEventBus<'inc' | 'dec', number>('bus')
  on((event, payload) => counter[event](payload))
</script>
  
<style lang='less' scoped>
  
</style>