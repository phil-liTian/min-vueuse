
<template>
  <div>
    <!-- core -->
     <h4>core</h4>
    <useEventListener />
    <useMounted />
    <useMemory />
    <useMouse />
    <useTitle />
    <useBattery />

    <!-- math -->
     <h4>math</h4>
    <useMax />
    <useMin />
  </div>
</template>
  
<script lang='ts' setup>
  import useEventListener from "./core-demo/useEventListener.vue";
  import useMounted from "./core-demo/useMounted.vue";
  import useMemory from "./core-demo/useMemory.vue";
  import useMouse from "./core-demo/useMouse.vue";
  import useTitle from "./core-demo/useTitle.vue";
  import useBattery from "./core-demo/useBattery.vue";

  // math
  import useMax from './math-demo/useMax.vue'
  import useMin from "./math-demo/useMin.vue";
</script>
  
<style lang='less' scoped>
  
</style>