<template>
  <div>useRafFn
    <p>count: {{ count }}</p>
    <p>delta: {{ deltaMs.toFixed(0) }}</p>
    <button @click="pause">pause</button>
    <button @click="resume">resume</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useRafFn } from '@mini-vueuse/core'
  import { ref } from 'vue';
  const fpsLimit = 60
  const count = ref(0)
  const deltaMs = ref(0)
  const { resume, pause } = useRafFn(({ delta }) => {
    console.log('delta', delta);
    deltaMs.value = delta
    count.value ++
  }, { fpsLimit })
</script>
  
<style lang='less' scoped>
  
</style>