<template>
  <div>useVModel parent: {{  props.age  }} {{ age }}
    <UseVModelChild v-model:pageMap="pageMap" v-model:d-props="props" v-model:age="age" v-model:name="name" />
  </div>
</template>
  
<script lang='ts' setup>
  import { ref } from 'vue';
  import UseVModelChild from './useVModelChild.vue';
  const props = ref({
    age: 18,
    name: 'phil',
    data: {
      gender: 1
    }
  })

  const pageMap = ref({
    index: 'storeIndex',
    my: 'xmf-my'
  })

  const age = ref(10)
  const name = ref('phil')

</script>
  
<style lang='less' scoped>
  
</style>