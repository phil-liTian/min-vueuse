<template>
  <div ref="el">useMouseHover: {{ isHover }}</div>

  <div v-element-hover="[handleHover, { delayEnter: 1000 }]">
    directive: useMouseHover
  </div>
</template>
  
<script lang='ts' setup>
  import { useElementHover } from '@mini-vueuse/core'
  import { vElementHover } from '@mini-vueuse/components'
  import { ref } from 'vue';
  const el = ref<HTMLElement>()
  const isHover = useElementHover(el, { delayEnter: 1000 })
  const handleHover = e => {
    console.log('handleHover', e);
  }
</script>
  
<style lang='less' scoped>
  
</style>