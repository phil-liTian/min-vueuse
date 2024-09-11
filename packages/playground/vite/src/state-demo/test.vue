<template>
  <div>test: {{ counter }}</div>
</template>
  
<script lang='ts' setup>
  import { useGlobalState } from './global'

  const { counter } = useGlobalState()
</script>
  
<style lang='less' scoped>
  
</style>