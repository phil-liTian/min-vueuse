
<template>
  <div>
    <useEventListener />
    <useMounted />
    <useMemory />
    <useMouse />
  </div>
</template>
  
<script lang='ts' setup>
  import useEventListener from "./core-demo/useEventListener.vue";
  import useMounted from "./core-demo/useMounted.vue";
  import useMemory from "./core-demo/useMemory.vue";
  import useMouse from "./core-demo/useMouse.vue";
</script>
  
<style lang='less' scoped>
  
</style>