<template>
  <div>useTitle
    <input type="text" v-model="title" @change="handleChange" />
  </div>
</template>
  
<script lang='ts' setup>
  import { useTitle } from '@mini-vueuse/core'
  const title = useTitle('mini-vueuse')

  const handleChange = () => {
    
  }
</script>
  
<style lang='less' scoped>
  
</style>