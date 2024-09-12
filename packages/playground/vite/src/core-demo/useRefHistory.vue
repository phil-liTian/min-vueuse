<template>
  <div>
    <p>useRefHistory: {{ history }}</p>
    <button @click="v++">add</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useRefHistory } from '@mini-vueuse/core'
  import { ref } from 'vue';
  const v = ref(0)
  const { history } = useRefHistory(v)
</script>
  
<style lang='less' scoped>
  
</style>