<template>
  <div>
    <p>useInfiniteScroll</p>
    <div ref="el" class="flex flex-col gap-2 overflow-y-scroll bg-gray-500/5 p-4 h-[300px]">
      <div class="h-15 bg-gray-500/5 rounded p-3" v-for="item in data" :key="item">{{ item }}</div>
    </div>

    <button @click="handleReset">reset</button>

    <p>directive: infiniteScroll</p>
    <div v-infinite-scroll="[handleLoadMoreData1, { interval: 200 }]" class="flex flex-col gap-2 overflow-y-scroll bg-gray-500/5 p-4 h-[300px]">
      <div class="h-15 bg-gray-500/5 rounded p-3" v-for="item in data1" :key="item">{{ item }}</div>
    </div>
  </div>
</template>
  
<script lang='ts' setup>
  import { ref } from "vue";
  import { useInfiniteScroll } from '@mini-vueuse/core'
  import { vInfiniteScroll } from '@mini-vueuse/components'
  const el = ref<HTMLElement | null>()
  const data = ref<number[]>([])
  const data1 = ref<number[]>([])

  const { reset } = useInfiniteScroll(el, (a) => {
    console.log('a');
    
    data.value = data.value.concat(Array.from({ length: 6 }).map((_, i) => i + data.value.length + 1))
  }, { distance: 10 })

  function handleLoadMoreData1() {
    data1.value = data1.value.concat(Array.from({ length: 6 }).map((_, i) => 100 + i + data1.value.length + 1))
  }

  const handleReset = () => {
    data.value = []
    reset()
  }
</script>
  
<style lang='less' scoped>
  
</style>