<template>
  <div>useToggle: {{ status }} <button @click="toggle()">toggle</button></div>
</template>
  
<script lang='ts' setup>
  import { useToggle } from '@mini-vueuse/shared'
  const [status, toggle] = useToggle()
</script>
  
<style lang='less' scoped>
  
</style>