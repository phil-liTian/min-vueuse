<template>
  <div>
    <span>{{ flag }}</span>
    <button @click="flag = !flag">click</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { whenever } from '@mini-vueuse/shared'
  import { ref } from 'vue';
  const flag = ref(false)
  whenever(flag, () => {
    console.log('flag');
  })
</script>
  
<style lang='less' scoped>
  
</style>