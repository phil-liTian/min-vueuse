<template>
  <div>
    <p>useInfiniteScroll</p>
    <div ref="el" class="flex flex-col gap-2 overflow-y-scroll bg-gray-500/5 p-4 h-[300px]">
      <div class="h-15 bg-gray-500/5 rounded p-3" v-for="item in data" :key="item">{{ item }}</div>
    </div>
  </div>
</template>
  
<script lang='ts' setup>
  import { ref } from "vue";
  import { useInfiniteScroll } from '@mini-vueuse/core'
  const el = ref<HTMLElement | null>(null)
  const data = ref<number[]>([])
  
  useInfiniteScroll(el, () => {
    // data.value = data.value.concat(Array.from({ length: 10 }).map((_, i) => i + data.value.length + 1))
  })
</script>
  
<style lang='less' scoped>
  
</style>