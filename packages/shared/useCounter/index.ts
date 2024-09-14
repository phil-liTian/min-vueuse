import { ref, unref } from "vue";
import { MaybeRef } from "../utils";


export interface UseCounterOptions {
  max?: number,
  min?: number
}

export function useCounter(initialValue: MaybeRef<number> = 0, options: UseCounterOptions = {}) {
  let _initialValue = unref(initialValue)
  const count = ref(initialValue)

  const {
    max = Number.POSITIVE_INFINITY,
    min = Number.NEGATIVE_INFINITY
  } = options
  
  const inc = (delta = 1)  => count.value = Math.min(max, Math.max(count.value + delta, min))

  const dec = (delta = 1) => count.value = Math.max(min, Math.min(count.value - delta, max))

  const get = () => count.value

  // Math.max(min, Math.min(value, max))
  const set = (value: number) => count.value = Math.min(max, Math.max(value, min))

  const reset = (val = _initialValue) => {
    _initialValue = val
    return set(val)
  }

  return { count, get, inc, dec, set, reset }
}
