<template>
  <div>
    <p>useInterval: {{ counter }}</p>
    <button @click="pause">停止</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useInterval } from '@mini-vueuse/shared'
  const { counter, pause } = useInterval(1000, { controls: true })

</script>
  
<style lang='less' scoped>
  
</style>