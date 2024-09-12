<template>
  <div>
    useCloned: {{ cloned?.test }}
    plainCloned: {{ plainCloned?.test }}
    <button @click="data.test = 'new-test'">change</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useCloned } from '@mini-vueuse/core'
  import { ref, unref } from 'vue';

  const data = ref({ test: 'test' })
  const { cloned, sync } = useCloned(data)

  const plainData = { test: 'test' }
  const { cloned: plainCloned } = useCloned(unref(data))
</script>
  
<style lang='less' scoped>
  
</style>