<template>
  <div>useCounter: {{ count }}
    <p><button @click="set(30)">set30</button></p>
  </div>
</template>
  
<script lang='ts' setup>
  import { useCounter } from '@mini-vueuse/shared'
  import { ref } from 'vue';

  const v = ref(0)
  const { count, set } = useCounter(v, { min: 10, max: 20 })


</script>
  
<style lang='less' scoped>
  
</style>