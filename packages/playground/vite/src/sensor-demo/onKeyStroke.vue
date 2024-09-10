<template>
  <div class="stroke-demo" v-on-key-stroke:c,v="onUpdate">
    <p>onKeyStroke-demo</p>
  </div>
</template>
  
<script lang='ts' setup>
  import { onKeyStroke } from '@mini-vueuse/core'
  import { vOnKeyStroke } from '@mini-vueuse/components'


  onKeyStroke('w', (e) => {
    console.log('e===>', e);
  }, { dedupe: true })

  const onUpdate = (e) => {
    console.log('update');
  }
</script>
  
<style lang='less' scoped>
  .stroke-demo {
    width: 100px;
    height: 100px;
  }
</style>