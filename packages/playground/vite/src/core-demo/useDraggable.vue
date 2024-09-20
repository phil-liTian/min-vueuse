<template>
  <div class="container" ref="containerRef">
    useDraggable: {{ isDragging }} {{ position }}

    <div ref="el" :style="style" class="w-40 h-20 cursor-move x-2 y-4 fixed orange"></div>
  </div>

  <UseDraggable 
    :handle="handleRef"
    :initial-value="{ x: 100, y: 100}"
    class="w-40 h-20 cursor-move x-2 y-4 fixed orange" v-slot="{ position }">
    <div class="dragHandle" ref="handleRef">drag</div>

    <div>正文</div>
  </UseDraggable>


</template>
  
<script lang='ts' setup>
  import { useDraggable } from '@mini-vueuse/core'
  import { UseDraggable } from '@mini-vueuse/components'
  import { ref } from 'vue';
  const containerRef = ref<HTMLElement | null>(null)
  const handleRef = ref<HTMLElement | null>(null)
  const el = ref<HTMLElement | null>(null)
  const { style, isDragging, position } = useDraggable(el, { containerElement: containerRef })
  
</script>
  
<style lang='less' scoped>

  .container {
    // position: absolute;
    // left: 100px;
    // top: 100px;
    width: 500px;
    height: 500px;
    margin-left: 100px;
  }
  .orange {
    background-color: orange;

  }
</style>