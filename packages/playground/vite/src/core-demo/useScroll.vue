<template>
  <div ref="scrollRef" class="scroll-wrap">
    <div class="scroll-inner ">
      <div class="fixed">
        <pre>useScroll inner: {{ isScrolling }}</pre>
        <pre>useScroll directions: {{ directions }}</pre>
        <pre>arrivedState: {{ arrivedState }}</pre>
      </div>
    </div>
  </div>
  <input type="text" v-model="x" />

  <div ref="scrollRef" class="scroll-wrap" v-scroll="handleScroll">
    <div class="scroll-inner "></div>
  </div>

</template>
  
<script lang='ts' setup>
  import { useScroll } from '@mini-vueuse/core'
  import { vScroll } from '@mini-vueuse/components'
  import { ref } from 'vue';
  const scrollRef = ref(null)
  const { x, isScrolling, directions, arrivedState } = useScroll(scrollRef, { behavior: 'smooth' })

  const handleScroll = state => {
    const { isScrolling } = state
    console.log('isScrolling', isScrolling.value);
  }
</script>
  
<style lang='less' scoped>
  .scroll-wrap {
    width: 300px;
    height: 300px;
    overflow: auto;
    .scroll-inner {
      width: 500px;
      height: 500px;
    }
  }
</style>