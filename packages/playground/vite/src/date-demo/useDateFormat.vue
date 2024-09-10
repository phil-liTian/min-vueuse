<template>
  <div>
    <span>useDateFormat</span>
  </div>
</template>
  
<script lang='ts' setup>
  import { useDateFormat } from '@mini-vueuse/shared'

  const date = useDateFormat(new Date(), 'Yo-MM-DD')
  console.log('date=--->', date.value);
</script>
  
<style lang='less' scoped>
  
</style>