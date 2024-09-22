<template>
  <div>
    useTransition
    <button @click="toggle">toggle</button>
    {{ cubicBezierNumber.toFixed(2) }}
    <div class="track number mt-2">
      <div class="relative">
        <div class="sled" :style="{ left: `${cubicBezierNumber}%` }" />
      </div>
    </div>
  </div>
</template>
  
<script lang='ts' setup>
  import { useTransition, executeTransition, TransitionPresets } from '@mini-vueuse/core'
  import { ref } from 'vue';
  const source = ref(0)
  executeTransition(source, 0, 1, { duration: 50,
    transition: [0.75, 0, 0.25, 1]
   })

  const tranSource = ref(0)

  const toggle = () => {
    baseNumber.value = baseNumber.value === 100 ? 0 : 100
  }

  useTransition(tranSource, { duration: 50 })
  setTimeout(() => {
    tranSource.value = 1
  }, 50);

  const baseNumber = ref(0)

  const cubicBezierNumber = useTransition(baseNumber, { 
    duration: 1000,  
    // transition: [0.75, 0, 0.25, 1] 
    transition: TransitionPresets.easeInOutQuad
  })
</script>
  
<style lang='less' scoped>
  @main-color: #44bd87;
  .track {
    background: rgba(125, 125, 125, 0.3);
    border-radius: 0.5rem;
    max-width: 20rem;
    width: 100%;
    height: 1em;
    padding: 0 0.5em;

    .sled {
      position: absolute;
      height: 1em;
      background-color: @main-color;
      width: 1em;
      border-radius: 50%;
      transform: translateX(-50%);
    }
  }
</style>