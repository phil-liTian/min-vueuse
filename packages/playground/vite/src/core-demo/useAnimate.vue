<template>
  <div>
    <div class="flex items-center justify-center w-full h-60">
      <p ref="el" class="text-5xl! font-800">Animate</p>
    </div>

    <div ref="container">旋转、由近及远</div>
    <button @click="play">play</button>
    <button @click="pause" class="mx-2">pause</button>
    <button @click="reverse">reverse</button>
    <button @click="finish" class="mx-2">finish</button>
    <button @click="cancel">cancel</button>

    <button @click="play2" class="mt-2">play2</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useAnimate } from '@mini-vueuse/core'
  import { ref } from 'vue';

  const el = ref(null)

  const container = ref(null)

  const { isSupported, play, pause, reverse, cancel, finish } = useAnimate(el, 
    [
      { clipPath: 'circle(20% at 0% 30%)' },
      { clipPath: 'circle(20% at 50% 80%)' },
      { clipPath: 'circle(20% at 100% 30%)' },
    ], { 
      duration: 3000,
      iterations: 5,
      direction: 'alternate',
      easing: 'cubic-bezier(0.46, 0.03, 0.52, 0.96)',
    })

    const { play: play2 } = useAnimate(container, [
      { transform: 'rotate(0) scale(1)' },
      { transform: 'rotate(360deg) scale(0)' },
    ], { duration: 1000, iterations: 1, direction: 'alternate', easing: 'cubic-bezier(0.46, 0.03, 0.52, 0.96)', })
</script>
  
<style lang='less' scoped>
  
</style>