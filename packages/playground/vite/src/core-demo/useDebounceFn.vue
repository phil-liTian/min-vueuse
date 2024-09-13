<template>
  <div>
    <p>useDebounceFn</p>
    <button @click="testFn">debounce</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useDebounceFn } from '@mini-vueuse/shared'

  const test = () => {
    console.log('test');
  }

  const testFn = useDebounceFn(test, 2000, { maxWait: 200 } )

</script>
  
<style lang='less' scoped>
  
</style>