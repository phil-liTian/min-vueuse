<template>
  <div>
    useOnline: {{ isOnline }}

    <UseOnline v-slot="{ isOnline }">
      onLineComponent: {{ isOnline }}
    </UseOnline>
  </div>
</template>
  
<script lang='ts' setup>
  import { useOnline } from '@mini-vueuse/browser'
  import { UseOnline } from '@mini-vueuse/components'
  const isOnline = useOnline()
</script>
  
<style lang='less' scoped>
  
</style>