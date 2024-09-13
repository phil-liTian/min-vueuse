<template>
  <div>
    watchWithFilter: {{ v }} <button @click="v++">withFilter</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useDebounceFn, watchWithFilter, debounceFilter } from '@mini-vueuse/shared'
  import { ref } from 'vue';
  const v = ref(0)
  watchWithFilter(v, () => {
    console.log('aaaa');
  }, {
    eventFilter: debounceFilter(1000)
  })
</script>
  
<style lang='less' scoped>
  
</style>