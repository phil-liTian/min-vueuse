<template>
  <div>
    <p>useStorage: {{ a }}</p>
    <p>{{ e }}</p>
    <button @click="handleAdd">add</button>
  </div>
</template>
  
<script lang='ts' setup>
  import { useStorage, useLocalStorage, useSessionStorage, useStorageSync } from '@mini-vueuse/core';
  import { nextTick, ref } from 'vue';
  const value = ref(1)
  const key = 'phil-vueuse-storage'
  localStorage.setItem(key, JSON.stringify({ a: '12' }))

  const a = useStorage(key, { a: '34', name: 'phil' }, localStorage, { mergeDefaults: true })
  // const a = useStorage('phil-vueuse-storage', new Date('2024-09-18T07:11:31.115Z'))
  const ref1 = useStorage(key, 0, {
    getItem: () => null,
    setItem: () => { 
      throw new Error('write item error')
    }
  } as unknown as Storage)

  const handleAdd = () => {
    ref1.value++

    value.value++
  }

  const b = useStorage(key, { name: 'phil', age: '27' }, sessionStorage)

  const c = useLocalStorage('test1', { type: 'useLocalStorage' })

  const d = useSessionStorage('test2', { type: 'useSessionStorage' })

  const e = useStorageSync('test3', { name: 'phil', age: '28' })

</script>
  
<style lang='less' scoped>
  
</style>