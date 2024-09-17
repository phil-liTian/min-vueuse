<template>
  <div>
    <p>usePageLeave: {{ isLeft }}</p>
    <UsePageLeave v-slot="{ isLeft }">
      usePageLeave component: {{ isLeft }}
    </UsePageLeave>
  </div>
</template>
  
<script lang='ts' setup>
  import { usePageLeave } from '@mini-vueuse/core'
  import { UsePageLeave } from '@mini-vueuse/components'

  const isLeft = usePageLeave()
</script>
  
<style lang='less' scoped>
  
</style>