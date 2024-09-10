
<template>
  <div>
    <!-- core -->
     <h4>core</h4>
    <!-- <useEventListener />
    <useMounted />
    <useMemory />
    <useMouse />
    <useBattery /> -->
    <useTitle />

    <!-- math -->
     <h4>math</h4>
    <useMax />
    <useMin />
    <useTrunc />
    <useCeil />
    <useFloor />
    <useAbs />

    <!-- <h4>sensor</h4>
    <onClickOutside />
    <onKeyStroke />
    <onStartTyping />

    <h4>watch</h4>
    <whenever />

    <h4>date</h4>
    <useDateFormat />
    <useTimeAgo /> -->
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
  import useTrunc from "./math-demo/useTrunc.vue";
  import useCeil from "./math-demo/useCeil.vue";
  import useFloor from "./math-demo/useFloor.vue";
  import useAbs from "./math-demo/useAbs.vue";

  // sensor
  import onClickOutside from "./sensor-demo/onClickOutside.vue";
  import onKeyStroke from "./sensor-demo/onKeyStroke.vue";
  import useLongPress from "./sensor-demo/useLongPress.vue";
  import onStartTyping from "./sensor-demo/onStartTyping.vue";

  // watch
  import whenever from "./watch-demo/whenever.vue";

  // date
  import useDateFormat from "./date-demo/useDateFormat.vue";
  import useTimeAgo from "./date-demo/useTimeAgo.vue";
</script>
  
<style lang='less' scoped>
  
</style>