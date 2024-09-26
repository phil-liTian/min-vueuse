<template>
  <div>
    <p>ref</p>
    <div>
      <h4>extendRef</h4>
      <span>extended.value: {{ extended }}</span>
      <br />
      <span>extended.foo: {{ extended }}</span>
      <br>
      <span>extended1: {{ extended1.foo }}</span>
    </div>
    
    <div>
      <h4>refAutoReset:: {{ resetRef }}</h4>
      <button @click="resetRef = 1">resetRefChange</button>
    </div>

    <div>
      <h4>refDetault: {{ refValue }}</h4>
    </div>

    <div>
      <h4>toRef</h4>
      <p>{{ toRefA }} {{ toRefArrayA }} {{ toRefFunA }}</p>
    </div>
  </div>
</template>
  
<script lang='ts' setup>
  import { extendRef, refAutoReset, refDefault, toRef } from '@mini-vueuse/shared'
  import { ref } from 'vue';
  const myRef = ref('content')

  const extended = extendRef(myRef, { foo: 'extra-foo' })

  console.log('extraRef', extended.foo);

  const extraRef = ref({ foo: 'extra-foo1' })
  
  const myRef1 = ref('content')
  const extended1 = extendRef(myRef1, extraRef)
  console.log('extended', extended.foo);

  const resetRef = refAutoReset(2, 1000)

  const a = ref()
  const refValue = refDefault(a, 'refDefaultValue')

  const contextA = 'a'
  const toRefA = toRef(contextA)
  console.log('toRefA', toRefA);

  const arrayA = [1,2,3]
  const toRefArrayA = toRef(arrayA)
  const funA = () => 'funcA'
  const toRefFunA = toRef(funA)
  
  
</script>
  
<style lang='less' scoped>
  
</style>