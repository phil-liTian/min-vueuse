<template>
  <div>
    useProjection: {{ count }} -- {{ projected }}
    <button @click="handleAdd">{{ 'add' }}</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { createProjection } from '@mini-vueuse/math'
import { useCounter } from '@mini-vueuse/shared';
  const useProject = createProjection([0, 10], [0, 100])
  const { count, inc } = useCounter(0)
  const projected = useProject(count)
  const handleAdd = () => {
    inc()
  }
</script>
  
<style lang='less' scoped>
  
</style>