<template>
  <div>
    <p>useActiveElement</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <input :data-id="item" class="!my-0 !min-w-0 w-50" type="text" v-for="item in 6" :key="item" />
    </div>

    <p>current active element: {{ key }}</p>
  </div>

  <UseActiveElement v-slot="{ element }">
    
    <p>component: current active element: {{ element }}</p>
  </UseActiveElement>
</template>
  
<script lang='ts' setup>
  import { useActiveElement } from '@mini-vueuse/core'
  import { UseActiveElement } from '@mini-vueuse/components'
  import { computed } from 'vue';

  const activeElement = useActiveElement()

  const key = computed(() => {
    return activeElement.value?.dataset?.id || null
  })
  
</script>
  
<style lang='less' scoped>
  
</style>