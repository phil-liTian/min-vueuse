<template>
  <div>
    <p>useIdle: {{ idle }} {{ lastActive }}</p>
    <UseIdle v-slot="{ idle, lastActive }" :timeout="1000">
      <div>
        <p>idle: {{ idle }}</p>
        <p>lastActive: {{ lastActive }}</p>
      </div>
    </UseIdle>
  </div>
</template>
  
<script lang='ts' setup>
  import { useIdle } from '@mini-vueuse/core'
  import { UseIdle }from '@mini-vueuse/components'
  const { idle, lastActive } = useIdle(1000)
</script>
  
<style lang='less' scoped>
  
</style>