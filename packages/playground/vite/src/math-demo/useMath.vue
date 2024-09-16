<template>
  <div>useMath: {{ v }}</div>
</template>
  
<script lang='ts' setup>
  import { useMath } from '@mini-vueuse/math'
  import { ref } from 'vue';
  const num = ref(-10)
  const v = useMath('abs', num)
</script>
  
<style lang='less' scoped>
  
</style>