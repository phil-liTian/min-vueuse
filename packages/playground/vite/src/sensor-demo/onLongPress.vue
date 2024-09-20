<template>
  <div>
    <p>useLongPress</p>
    <button ref="htmlRef">longPress</button>
  </div>

  <OnLongPress @trigger="handleTrigger">
    <p>component</p>
    <button>longPress</button>
  </OnLongPress>

  <p v-on-long-press="handleLongPress">longPress directive</p>
</template>
  
<script lang='ts' setup>
  import { onLongPress } from '@mini-vueuse/core';
  import { OnLongPress, vOnLongPress } from '@mini-vueuse/components'
  import { ref } from 'vue';
  const htmlRef = ref<HTMLElement | null>(null)

  function onLongPressClick() {
    console.log('onLongPressClick');
  }
  function handleTrigger(e) {
    console.log('trigger', e);
  }

  function handleLongPress() {
    console.log('directive handleLongPress');
  }

  onLongPress(htmlRef, onLongPressClick)
</script>
  
<style lang='less' scoped>
  
</style>