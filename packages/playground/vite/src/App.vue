
<template>
  <div>
    <!-- core -->
     <!-- <h4>core</h4>
    <useEventListener />
    <useMounted />
    <useMemory />
    <useMouse />
    <useBattery />
    <useTitle />
    <useNetwork />
    <useNow />
    <useToggle />
    <useCloned />
    <useManualRefHistory />
    <useRefHistory />
    <useFps />
    <useDebounceFn />
    <watchWithFilter />
    <watchDebounced />
    <refDebounce />
    <tryOnBeforeMount />
    <useVModel />
    <useThrottle />
    <useCounter />
    <useEventBus />
    <useEventBusSib /> 
    <useClipboard />
    <usePermission />
    <useInterval />
    <useTimeStamp />
    <reactify /> -->


    <!-- math -->
     <!-- <h4>math</h4>
    <useMax />
    <useMin />
    <useTrunc />
    <useCeil />
    <useFloor />
    <useAbs />
    <usePrecision />
    <useProjection />
    <useClamp />
    <useMath /> -->

    <!-- <h4>sensor</h4>
    <onClickOutside />
    <onKeyStroke />
    <onStartTyping /> -->

    <!-- <h4>watch</h4>
    <whenever />
    <watchArray /> -->

    <!-- <h4>date</h4>
    <useDateFormat />
    <useTimeAgo /> -->

    <!-- <h4>动画</h4>
    <useRafFn /> -->

    <!-- <h4>状态</h4>
    <createGlobalState />
    <test /> -->

    <h4>array</h4>
    <useArrayEvery />
    <useArrayDifference />


    <h4>browser</h4>
    <useOnline />

  </div>
</template>
  
<script lang='ts' setup>
  import useEventListener from "./core-demo/useEventListener.vue";
  import useMounted from "./core-demo/useMounted.vue";
  import useMemory from "./core-demo/useMemory.vue";
  import useMouse from "./core-demo/useMouse.vue";
  import useTitle from "./core-demo/useTitle.vue";
  import useBattery from "./core-demo/useBattery.vue";
  import useNetwork from "./core-demo/useNetwork.vue";
  import useNow from "./core-demo/useNow.vue";
  import useToggle from "./core-demo/useToggle.vue";
  import useCloned from "./core-demo/useCloned.vue";
  import useManualRefHistory from "./core-demo/useManualRefHistory.vue";
  import useRefHistory from "./core-demo/useRefHistory.vue";
  import useFps from "./core-demo/useFps.vue";
  import useDebounceFn from "./core-demo/useDebounceFn.vue";
  import watchWithFilter from "./core-demo/watchWithFilter.vue";
  import watchDebounced from "./core-demo/watchDebounced.vue";
  import refDebounce from "./core-demo/refDebounce.vue";
  import tryOnBeforeMount from "./core-demo/tryOnBeforeMount.vue";
  import useVModel from "./core-demo/useVModel(s).vue";
  import useThrottle from "./core-demo/useThrottle.vue";
  import useCounter from "./core-demo/useCounter.vue";
  import useEventBus from "./core-demo/useEventBus.vue";
  import useEventBusSib from "./core-demo/useEventBusSib.vue";
  import useClipboard from "./core-demo/useClipboard.vue";
  import usePermission from "./core-demo/usePermission.vue";
  import useInterval from "./core-demo/useInterval.vue";
  import useTimeStamp from "./core-demo/useTimeStamp.vue";
  import reactify from "./core-demo/reactify.vue";

  // 动画
  import useRafFn from "./core-demo/useRafFn.vue";

  // math
  import useMax from './math-demo/useMax.vue'
  import useMin from "./math-demo/useMin.vue";
  import useTrunc from "./math-demo/useTrunc.vue";
  import useCeil from "./math-demo/useCeil.vue";
  import useFloor from "./math-demo/useFloor.vue";
  import useAbs from "./math-demo/useAbs.vue";
  import usePrecision from "./math-demo/usePrecision.vue";
  import useProjection from "./math-demo/useProjection.vue";
  import useClamp from "./math-demo/useClamp.vue";
  import useMath from "./math-demo/useMath.vue";

  // sensor
  import onClickOutside from "./sensor-demo/onClickOutside.vue";
  import onKeyStroke from "./sensor-demo/onKeyStroke.vue";
  import useLongPress from "./sensor-demo/useLongPress.vue";
  import onStartTyping from "./sensor-demo/onStartTyping.vue";

  // watch
  import whenever from "./watch-demo/whenever.vue";
  import watchArray from "./watch-demo/watchArray.vue";

  // date
  import useDateFormat from "./date-demo/useDateFormat.vue";
  import useTimeAgo from "./date-demo/useTimeAgo.vue";

  // state
  import createGlobalState from "./state-demo/createGlobalState.vue";
  import test from "./state-demo/test.vue";

  // array
  import useArrayEvery from "./array-demo/useArrayEvery.vue";
  import useArrayDifference from "./array-demo/useArrayDifference.vue";

  // browser
  import useOnline from './browser-demo/useOnline.vue'
</script>
  
<style lang='less' scoped>
  
</style>