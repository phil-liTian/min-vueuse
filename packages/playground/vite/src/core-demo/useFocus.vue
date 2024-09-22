<template>
  <div>useFocus: {{ focused }}
    <input type="text" ref="inputRef" />
  </div>
</template>
  
<script lang='ts' setup>
  import { useFocus } from '@mini-vueuse/core'
  import { ref } from 'vue';

  const inputRef = ref<HTMLInputElement | null>(null)

  const { focused } = useFocus(inputRef, { initialValue: true })
</script>
  
<style lang='less' scoped>
  
</style>