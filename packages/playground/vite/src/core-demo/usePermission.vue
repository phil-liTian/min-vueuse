<template>
  <div>
    <p>usePermission</p>
    <button @click="handleGet">get</button>
    <button @click="query">singleTon</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { usePermission } from '@mini-vueuse/core'

  const clipboardRead = usePermission('clipboard-read')

  const camera = usePermission('camera')
  const notifications = usePermission('notifications')
  const backgroundSync = usePermission('background-sync')

  const { state, query } = usePermission('clipboard-write', { controls: true })
  
  const handleGet = () => {
    console.log('clipboardRead', clipboardRead.value);
    console.log('camera', camera.value);
    console.log('notifications', notifications.value);
    console.log('backgroundSync', backgroundSync.value);
  }
</script>
  
<style lang='less' scoped>
  
</style>