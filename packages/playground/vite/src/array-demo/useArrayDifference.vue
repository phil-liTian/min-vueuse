<template>
  <div>useArrayDifference: {{ result }}</div>
</template>
  
<script lang='ts' setup>
  import { useArrayDifference } from '@mini-vueuse/array'
  import { ref } from 'vue';

  const list1 = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
  const list2 = ref([{ id: 4 }, { id: 5 }, { id: 6 }])

  const result = useArrayDifference(list1, list2, 'id')
  list1.value = [{ id: 3 }]
</script>
  
<style lang='less' scoped>
  
</style>