<template>
  <div>
    <p>useIntersectionObserver: 《target visible: {{ isVisible }}》</p>
    
    <div ref="root" class="container">
      <p class="notice">scroll me down!</p>

      <div ref="target" class="target">hello mini-vueuse</div>
    </div>
  </div>
</template>
  
<script lang='ts' setup>
  import { useIntersectionObserver } from '@mini-vueuse/core';
  import { ref } from 'vue';

  const root = ref<HTMLElement | null>(null)
  const target = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  useIntersectionObserver(target, ([{ isIntersecting }]) => {
    isVisible.value = isIntersecting
  }, { root })

</script>
  
<style lang='less' scoped>
  .container {
    border: 2px dashed #ccc;
    height: 200px;
    margin: 2rem 1rem;
    overflow-y: scroll;

    .notice {
      text-align: center;
      padding: 2em 0;
      margin-bottom: 300px;
      font-style: italic;
      font-size: 1.2rem;
      opacity: 0.8;
    }

    .target {
      border: 2px dashed #000;
      padding: 10px;
      max-height: 150px;
      margin: 0 2rem 400px;
    }
  }
</style>