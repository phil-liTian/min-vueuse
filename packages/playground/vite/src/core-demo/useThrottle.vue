<template>
  <div>
    <p>throttle</p>
    <input type="text" v-model="value" />
    <p>
      refData: {{ refData }}
      updated: {{ updated }}
    </p>

    <button @click="throttleTest">click</button>

    <button @click="value++">add ref</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useThrottleFn, watchThrottled, refThrottled } from '@mini-vueuse/shared'
  import { ref, watch } from 'vue';
  const value = ref(0)
  const test = () => {
    console.log('test');
  }
  const throttleTest = useThrottleFn(test, 1000, { leading: false })
  watchThrottled(value, () => {
    console.log('changed');
  }, { throttle: 1000 })

  let updated = ref(0)
  const refData = refThrottled(value, { delay: 1000 })

  watch(refData, () => {
    updated.value++
  })

</script>
  
<style lang='less' scoped>
  
</style>