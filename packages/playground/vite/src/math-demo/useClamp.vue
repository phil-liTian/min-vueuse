<template>
  <div>
    <p>useClamp: {{ showValue }}</p>
    <button @click="add">add</button>
    <button @click="sub">sub</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useClamp } from '@mini-vueuse/math'
  import { useCounter } from '@mini-vueuse/shared';
  const { count, inc, dec } = useCounter()

  const showValue = useClamp(count, 0, 10)
  const add = () => {
    inc()
  }

  const sub = () => {
    dec()
  }
</script>
  
<style lang='less' scoped>
  
</style>