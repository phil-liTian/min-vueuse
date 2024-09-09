<template>
  <div>
    <span>hook用法: mouse: x: {{ x }}; y: {{ y }}</span>
    <div>
      组件用法
      <UseMouse v-slot="{ x, y }">
        x: {{ x }}, y : {{ y }}
      </UseMouse>
    </div>
    
  </div>
</template>
  
<script lang='ts' setup>
  import { useMouse } from '@mini-vueuse/core'
  import { UseMouse } from '@mini-vueuse/components'

  const { x, y } = useMouse()

</script>
  
<style lang='less' scoped>
  
</style>