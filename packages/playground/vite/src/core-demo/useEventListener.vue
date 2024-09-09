<template>
  <div @click="handleClick">useEventListener</div>
</template>
  
<script lang='ts' setup>

  import { useEventListener } from '@mini-vueuse/core'
  const handleClick = () => {
    console.log('clicked');
  }
  useEventListener(['click', 'mousedown'], [
    handleClick,
    () => {
      console.log('mousedown');
    }
  ])
</script>
  
<style lang='less' scoped>
  
</style>