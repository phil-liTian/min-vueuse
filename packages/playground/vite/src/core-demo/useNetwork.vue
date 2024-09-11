<template>
  <div>useNetwork:
    isOnline: {{ isOnline }}
    rtt: {{ rtt }}
    effectiveType: {{ effectiveType }}
    type: {{ type }}
  </div>
</template>
  
<script lang='ts' setup>
  import { useNetwork } from '@mini-vueuse/core'
  const { isOnline, rtt, effectiveType, type } = useNetwork()
</script>
  
<style lang='less' scoped>
  
</style>