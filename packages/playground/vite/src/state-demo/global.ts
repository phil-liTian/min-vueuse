import { createGlobalState } from '@mini-vueuse/shared'
import { ref } from 'vue'

const useGlobalState = createGlobalState(() => {
  const counter = ref(1)
  const onChange = (value: number) => {
    counter.value = value
  }

  return {
    counter,
    onChange
  }
})

export { useGlobalState }