<template>
  <div>useNetwork:
    isOnline: {{ isOnline }}
    rtt: {{ rtt }}
    effectiveType: {{ effectiveType }}
    type: {{ type }}

    <UseNetwork v-slot="{ isOnline, rtt, effectiveType, type }">
      isOnline {{ isOnline }}
    </UseNetwork>
  </div>
</template>
  
<script lang='ts' setup>
  import { useNetwork } from '@mini-vueuse/core'
  import { UseNetwork } from '@mini-vueuse/components'
  const { isOnline, rtt, effectiveType, type } = useNetwork()
</script>
  
<style lang='less' scoped>
  
</style>