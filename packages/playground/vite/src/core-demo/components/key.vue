<template>
  <div class="px-4 py-2 rounded" :class="value ? `opacity-100 text-primary bg-primary` : 'bg-gray-600 opacity-50'">
    <slot />
  </div>
</template>
  
<script lang='ts' setup>
  const props = defineProps({ 
    value: {
      type: Boolean,
      default: false
    }
  })
</script>
  
<style lang='less' scoped>
  .bg-primary {
    background-color: #0a0;
  }

  .text-primary {
    color: #fff;
  }
</style>