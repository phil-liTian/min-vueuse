import { computed, customRef } from 'vue'
import { MaybeRefOrGetter } from '../utils'
import { toValue } from '../toValue'

export function refAutoReset<T>(defaultValue: MaybeRefOrGetter<T>, afterMs: MaybeRefOrGetter<number> = 1000) {
  return customRef((track, trigger) => {
    let value = toValue(defaultValue)
    let timer: ReturnType<typeof setTimeout>

    const resetAfterFn = () => {
      timer = setTimeout(() => {
        value = toValue(defaultValue)
        trigger()
      }, toValue(afterMs))
    }

    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        value = newValue
        trigger()
        clearTimeout(timer)
        resetAfterFn()
      }
    }
  })
}
