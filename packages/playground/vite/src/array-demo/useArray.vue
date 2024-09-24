<template>
  <div>useArray
    <p>useArrayMap: {{ result }}</p>
    <p>useArrayReduce: {{ sum }}</p>
    <p>useSorted: {{ arr2 }} {{ sorted }}</p>
    <p>useSorted (dirty): {{ arr1 }} {{ dirtySorted }}</p>
    <p>useSorted (dirty): {{ arr3 }} {{ sorted }}</p>
  </div>
</template>
  
<script lang='ts' setup>
  import { useArrayMap, useArrayReduce, useArraySorted } from '@mini-vueuse/array'
  import { ref } from 'vue';
  const arr = ref([1, 2, 4, 5, 5])
  const result = useArrayMap(arr, item => item * 2)

  const sum = useArrayReduce(arr, (pre, cur) => {
    pre.push(cur) 
    return pre
  }, [1, 2, 3])

  const arr1 = [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]
  const arr2 = [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]

  const arr3 = ref([10, 3, 5, 7, 2, 1, 8, 6, 9, 4])

  const dirtySorted = useArraySorted(arr1, { dirty: true })
  const sorted = useArraySorted(arr3)
</script>
  
<style lang='less' scoped>
  
</style>