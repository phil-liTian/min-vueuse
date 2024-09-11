<template>
  <div>
    <span>useTimeAgo: {{ timeAgo }}</span>
    <p>dayTimeAgo: {{ dayTimeAgo }}</p>
  </div>
</template>
  
<script lang='ts' setup>
  import { computed } from 'vue'
  import { useTimeAgo } from '@mini-vueuse/core'
  const { timeAgo } = useTimeAgo(Date.now(), { controls: true, updateInterval: 500 })
  const baseTime = +new Date()
  const UNITS = [
    { max: 60000, value: 1000, name: 'second' },
    { max: 2760000, value: 60000, name: 'minute' },
    { max: 72000000, value: 3600000, name: 'hour' },
    { max: 518400000, value: 86400000, name: 'day' },
    { max: 2419200000, value: 604800000, name: 'week' },
    { max: 28512000000, value: 2592000000, name: 'month' },
    { max: Number.POSITIVE_INFINITY, value: 31536000000, name: 'year' },
  ]
  function getNeededTimeChange(type, count: number, adjustSecond?: number) {
    
    const unit = UNITS.find(i => i.name === type)
    return (unit?.value || 0) * count + (adjustSecond || 0) * 1000 
  }

  const changeValue = computed(() => getNeededTimeChange('day', 1))

  const changeTime = computed(() => baseTime + changeValue.value)

  const { timeAgo: dayTimeAgo } = useTimeAgo(changeTime, { controls: true })
  
</script>
  
<style lang='less' scoped>
  
</style>