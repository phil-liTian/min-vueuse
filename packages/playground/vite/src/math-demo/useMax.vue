<template>
  <div>max: {{ max }}</div>
</template>
  
<script lang='ts' setup>
  import { useMax } from '@mini-vueuse/math'
  import { ref } from 'vue';

  const max = useMax(1, ref(3), 100)
</script>
  
<style lang='less' scoped>
  
</style>