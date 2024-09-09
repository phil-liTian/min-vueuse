<template>
  <div>min: {{ min }}</div>
</template>
  
<script lang='ts' setup>
  import { useMin } from '@mini-vueuse/math'
  import { ref } from 'vue';

  const min = useMin(1, ref(3), 100)
</script>
  
<style lang='less' scoped>
  
</style>