<template>
  <div>
    <p>useGeolocation</p>
    <pre>{{ JSON.stringify({ coords, locatedAt }, null, 2) }}</pre>

    <UseGeolocation v-slot="{ isSupported, resume, pause, coords, locatedAt }">
      组件状态：{{ isSupported }}
      <pre>{{ JSON.stringify({ coords, locatedAt }, null, 2) }}
      </pre>
    </UseGeolocation>
  </div>
</template>
  
<script lang='ts' setup>
  import { useGeoLocation } from '@mini-vueuse/core'
  import { UseGeolocation } from '@mini-vueuse/components'
  const { isSupported, resume, coords, pause, locatedAt } = useGeoLocation();
  console.log('isSupported', isSupported.value);
  console.log('coords', JSON.stringify(coords.value, null, 2));
  
</script>
  
<style lang='less' scoped>
  
</style>