<template>
  <div>
    <p>onClickOutside</p>
    <!-- <div ref="clickRef" class="onClickOutside-page">function</div> -->
    <p class="ignore-dom">ignore</p>
    <!-- <OnClickOutside @trigger="triggerClickOutside">
      <div class="onClickOutside-page">component</div>
    </OnClickOutside> -->

    <div class="directive-dom" v-on-click-outside.capture="[handleClickOutside, { igore: [''] }]">directive</div>
  </div>
</template>
  
<script lang='ts' setup>
  import { ref } from 'vue'
  import { onClickOutside } from '@mini-vueuse/core'
  import { OnClickOutside, vOnClickOutside } from '@mini-vueuse/components';
  const clickRef = ref(null)
  onClickOutside(clickRef, () => {
    console.log('clicked');
  })

  const triggerClickOutside = () => {
    console.log('trigger');
  }

  const handleClickOutside = () => {
    console.log('directive trigger');
  }
</script>
  
<style lang='less' scoped>
  .onClickOutside-page {
    width: 160px;
    height: 160px;
    background-color: #ccc;
    
  }

  .ignore-dom {
    width: 100px;   
    height: 100px;
    background-color: #ddd;
  }

  .directive-dom {
    margin: 20px 0;
    width: 160px;
    height: 160px;
    background-color: #ccc;
  }
</style>