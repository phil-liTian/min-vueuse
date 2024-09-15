<template>
  <div>
    useTimeStamp: {{ timestamp }}
    <button @click="resume">resume</button>
    <button @click="pause">pause</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useTimeStamp } from '@mini-vueuse/core'

  const { timestamp, pause, resume } = useTimeStamp({ controls: true, immediate: false })
</script>
  
<style lang='less' scoped>
  
</style>