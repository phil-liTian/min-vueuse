<template>
  <div>
    useDraggable

    <div ref="el" :style="style" class="w-40 h-20 cursor-move x-2 y-4 fixed orange"></div>
  </div>
</template>
  
<script lang='ts' setup>
  import { useDraggable } from '@mini-vueuse/core'
  import { ref } from 'vue';

  const el = ref<HTMLElement | null>(null)
  const { style } = useDraggable(el)
  
</script>
  
<style lang='less' scoped>
  .orange {
    background-color: orange;

  }
</style>