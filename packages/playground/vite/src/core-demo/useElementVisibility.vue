<template>
  <div>
    <p>useElementVisibility</p>

    <div class="scroll-container" ref="scrollTarget">
      <div ref="target">target</div>
      <div class="target"></div>
    </div>
    <p>isVisible: {{ isVisible }}</p>

    <UseElementVisibility v-slot="{ isVisible }">
      <div>isVisible: {{ isVisible }}</div>
    </UseElementVisibility>
  </div>
</template>
  
<script lang='ts' setup>
  import { useElementVisibility } from '@mini-vueuse/core'
  import { UseElementVisibility } from '@mini-vueuse/components'
  import { ref } from 'vue';
  const target = ref<HTMLElement | null>(null)
  const scrollTarget = ref<HTMLElement | null>(null)

  const isVisible = useElementVisibility(target, {
    scrollTarget,
  })
</script>
  
<style lang='less' scoped>
  .scroll-container {
    width: 200px;
    height: 200px;
    overflow-y: auto;
    background-color: #ccc;
    .target {
      width: inherit;
      height: 500px;
      background: #0a0;
    }
  }
</style>