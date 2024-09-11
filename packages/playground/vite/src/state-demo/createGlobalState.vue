<template>
  <div>
    <span>createGlobalState: {{ counter }}</span>
    <p> <button @click="onChange(2)">change</button></p>
  </div>
</template>
  
<script lang='ts' setup>
  import { useGlobalState } from './global'

  const { counter, onChange } = useGlobalState()
</script>
  
<style lang='less' scoped>
  
</style>