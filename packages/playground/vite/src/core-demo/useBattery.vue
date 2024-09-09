<template>
  <div>useBattery:
    <span>charging: {{ charging }}</span>；
    <span>chargingTime: {{ chargingTime }}</span>；
    <span>dischargingTime: {{ dischargingTime }}</span>；
    <span>level: {{ level }}</span>
    <UseBattery v-slot="{ charging, dischargingTime }">
      <p>charging: {{ charging }}</p>
      <p>dischargingTime: {{ dischargingTime }}</p>
    </UseBattery>
  </div>
</template>
  
<script lang='ts' setup>
  import { useBattery } from '@mini-vueuse/core'
  import { UseBattery } from '@mini-vueuse/components'
  const { charging, dischargingTime, level, chargingTime } = useBattery()

</script>
  
<style lang='less' scoped>
  
</style>