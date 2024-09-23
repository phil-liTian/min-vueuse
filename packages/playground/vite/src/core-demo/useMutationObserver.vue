<template>
  <div ref="observerRef" id="header">
    useMutationObserver
    <button @click="handleChangeId">changeId</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useMutationObserver } from '@mini-vueuse/core';
import { ref } from 'vue';

  const observerRef = ref<HTMLElement | null>(null)
  console.log('observerRef', observerRef);
  
  const handleChangeId = () => {
    observerRef.value!.id = 'header-new'
    observerRef.value!.id = 'header-new1'
    console.log('takeRecords', takeRecords());

  }

  const { takeRecords } = useMutationObserver(observerRef, mutations => {
    console.log('mutations', mutations);
  }, { attributes: true })

  
</script>
  
<style lang='less' scoped>
  
</style>