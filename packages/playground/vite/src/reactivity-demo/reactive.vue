<template>
  <div>
    <p>reactive</p>
    <span>toReactive: {{ obj.a }} {{ reactiveObj.name }}</span>
  </div>
</template>
  
<script lang='ts' setup>
  import { toReactive } from '@mini-vueuse/shared'
  import { isReactive, ref } from 'vue';

  const test = ref({ name: 'mini-vueuse' })
  const obj = toReactive({
    a: 1,
    b: 2
  })

  const reactiveObj = toReactive(test)

  console.log('obj', isReactive(obj));
  
</script>
  
<style lang='less' scoped>
  
</style>