<template>
  <div>
    <p>useFocusWithin: {{ focused }}</p>
    <form ref="target" :tabIndex="0" class="form grid grid-cols-1 md:grid-cols-3 gap-2" action="">
      <input type="text" placeholder="first name" />
      <input type="text" placeholder="last name" />
      <input type="text" placeholder="email" />
      <input type="text" placeholder="password" />
    </form>
  </div>
</template>
  
<script lang='ts' setup>
  import { useFocusWithin } from '@mini-vueuse/core'
  import { ref } from 'vue';
  const target = ref(null)
  const { focused } = useFocusWithin(target)
</script>
  
<style lang='less' scoped>
  .form {
    width: 600px;
    background-color: #ccc;
    padding: 20px;
  }
</style>