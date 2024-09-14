<template>
  <div>child: 
    {{ dProps.age }} {{ userInfo.data?.gender }} {{  curAge  }}

    <!-- 使用passive之前 -->
    <!-- 这个属性之所以能改变 是因为对象类型 地址引用没变， -->
    <button @click="userInfo.age!++">changeAge</button>
    <!-- 当嵌套层级过深时, 无法监听到 -->
    <button @click="changeGender">changeGender</button>

    <button @click=curAge++>changeAge</button>

    <h3>useVModels</h3>
    <p>{{ name }}</p>
    <p> <button @click="handleChangeName">changeName</button> </p>
  </div>
</template>
  
<script lang='ts' setup>
  import { useVModel, useVModels } from '@mini-vueuse/core'
  import { PropType } from 'vue';
  type DProps = {
    age?: number,
    name?: string,
    data?: {
      gender?: number
    }
  }

  type IPageMap = {
    index: string,
    my: string
  }

  const props = defineProps({
    dProps: {
      type: Object as PropType<DProps>,
      default: () => ({}),
    },

    age: {
      type: Number as PropType<number>,
      default: 0
    },

    name: {
      type: String,
      default: ''
    },

    pageMap: {
      type: Object as PropType<IPageMap>,
      default: () => ({})
    }
  })

  const emit = defineEmits(['update:dProps', 'update:age', "update:index", "update:my", 'update:name'])

  const userInfo = useVModel(props, 'dProps', emit, { passive: true, deep: true })

  const curAge = useVModel(props, 'age', emit)

  const changeGender = () => {
    // userInfo.data.gender === 1 ? 0 : 1
    console.log('userInfo.value.data?.gender', userInfo.value.data?.gender);

    
    // userInfo.value.data?.gender === 1 ? 0 : 1

    // console.log('userInfo.value.data?.gender', userInfo.value.data?.gender);
  }

  const { name } = useVModels(props, emit)

  const handleChangeName = () => {
    name.value = 'phil-li'
  }
</script>
  
<style lang='less' scoped>
  
</style>