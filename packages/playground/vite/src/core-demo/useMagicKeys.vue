<template>
  <div class="grid gap-2">
    <p>useMagicKeys: {{ u }}</p>
    <p class="flex gap-3">
      <Key :value="u">u</Key>
      <Key :value="v">v</Key>
      <Key :value="j">j</Key>
    </p>

    <p class="flex gap-3">
      <Key :value="v_u_e">vue</Key>
      <Key :value="u_s_e">use</Key>
      <Key :value="shift">shift</Key>
      <Key :value="up">up</Key>
      <Key :value="down">down</Key>
      <Key :value="left">left</Key>
      <Key :value="right">right</Key>
      <Key :value="control">control</Key>
      <Key :value="alt">option</Key>
    </p>

    <p>key pressed: <code v-for="key in keys">{{ key }}</code></p>
  </div>
</template>
  
<script lang='ts' setup>
  import { useMagicKeys } from '@mini-vueuse/core'
  import Key from './components/key.vue'
  import { computed } from 'vue';
  const { u, v, j, shift, up, down, left, right, alt, control, v_u_e, u_s_e, current } = useMagicKeys()
  const keys = computed(() => Array.from(current))
  
</script>
  
<style lang='less' scoped>
  
</style>