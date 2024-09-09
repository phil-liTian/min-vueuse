import { ref, onMounted, getCurrentInstance } from "vue";

export function useMounted() {
  const isMounted = ref(false)
  const instance = getCurrentInstance()
  if ( instance ) {
    onMounted(() => {
      isMounted.value = true
    })
  }

  return isMounted
}