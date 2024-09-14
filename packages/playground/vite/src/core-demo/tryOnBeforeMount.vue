<template>
  <div v-if="show">tryOnBeforeMount</div>
</template>
  
<script lang='ts' setup>
  import { tryOnBeforeMount, tryOnMounted, tryOnUnmounted, tryOnBeforeUnmount } from '@mini-vueuse/shared';
  import { ref } from 'vue';

  const show = ref(true)

  tryOnBeforeMount(() => {
    console.log('tryOnBeforeMount');
  })

  tryOnMounted(() => {
    console.log('tryOnMounted');
  })

  tryOnBeforeUnmount(() => {
    console.log('tryOnBeforeUnmount');
  })

  tryOnUnmounted(() => {
    console.log('tryOnUnmounted');
    
  })

  // setTimeout(() => {
  //   show.value = false
  // }, 5000);
</script>
  
<style lang='less' scoped>
  
</style>