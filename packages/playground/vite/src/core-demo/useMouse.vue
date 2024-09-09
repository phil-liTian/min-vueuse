<template>
  <div>
    <span>hook用法: mouse: x: {{ x }}; y: {{ y }}</span>
    <br />
    <span>hook用法: mouse: clineX: {{ clentX }}; clientY: {{ clentY }}</span>
    <br />
    <span>hook用法: mouse: screenX: {{ screenX }}; screenY: {{ screenY }}</span>
    <br />
    <span>hook用法: mouse: movementX: {{ movementX }}; movementY: {{ movementY }}</span>
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
  const { x: clentX, y: clentY } = useMouse({ type: 'client' })
  const { x: screenX, y: screenY } = useMouse({ type: 'screen' })
  const { x: movementX, y: movementY } = useMouse({ type: 'movement' })

</script>
  
<style lang='less' scoped>
  
</style>