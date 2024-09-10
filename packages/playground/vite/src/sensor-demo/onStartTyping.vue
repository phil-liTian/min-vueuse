<template>
  <div>
    <span>onStartTyping</span>
    <input ref="inputRef" type="text" />

  </div>
</template>
  
<script lang='ts' setup>
  import { onStartTyping } from '@mini-vueuse/core'
  import { ref } from 'vue';

  const inputRef = ref()

  onStartTyping(() => {
    inputRef.value.focus()
  })
</script>
  
<style lang='less' scoped>
  
</style>