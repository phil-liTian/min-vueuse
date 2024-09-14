import { ref, Ref, watch } from "vue";
import { MaybeRefOrGetter, throttleFilter, ThrottleFilterOptions } from "../utils";
import { useThrottleFn } from "../useThrottleFn";

export interface RefThrottleOptions extends ThrottleFilterOptions {
  delay?: MaybeRefOrGetter<number>,

}

export function refThrottled<T>(value: Ref<T>, options: RefThrottleOptions = {}) {
  const {
    delay = 0,
    ...otherOptions
  } = options
  
  const throttled = ref(value.value as T) as Ref<T>
  const updater = () => useThrottleFn(() => {
    throttled.value = value.value
  }, delay, { ...otherOptions })

  watch(value, updater())

  return throttled
}