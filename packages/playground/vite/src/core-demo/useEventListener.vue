<template>
  <div @click="handleClick">1</div>
</template>
  
<script lang='ts'>

  import { useEventListener } from '@vueuse/core'
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