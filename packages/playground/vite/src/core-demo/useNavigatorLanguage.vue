<template>
  <div>useLanguage: {{ language }}</div>
</template>
  
<script lang='ts' setup>
  import { useNavigatorLanguage } from '@mini-vueuse/core'
  const { language } = useNavigatorLanguage()
</script>
  
<style lang='less' scoped>
  
</style>