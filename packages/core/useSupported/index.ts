import { computed } from "vue"
import { useMounted } from "../useMounted"

export function useSupported(callback: () => unknown) {
  const isMounted = useMounted()
  return computed(() => {
    // trigger ref
    isMounted.value
    return Boolean(callback())
  })
}

export default useSupported
