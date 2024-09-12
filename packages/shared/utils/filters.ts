import { ref } from "vue"
import { AnyFn, ArgumentsType } from "./types"

type EventFilter = any

export const byPassFilter: EventFilter = (invoke) => invoke()

export interface ConfigableEventFilter {
  eventFilter?: EventFilter
}

// 如何实现的可中断、可恢复？？？
export function pausableFilter(extendFilter: EventFilter = byPassFilter) {
  const isActive = ref(true)

  function pause() {
    isActive.value = false
  }

  function resume() {
    isActive.value = true
  }

  const eventFilter = (...args) => {
    if ( isActive.value )
      extendFilter(...args)
  }

  return { resume, pause, isActive, eventFilter }
}

export function createFilterWrapper<T extends AnyFn>(filter: EventFilter, fn: T) {
  function wrapper(this: any, ...args: ArgumentsType<T>) {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      // make sure it's a promise
      Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
        .then(resolve)
        .catch(reject)
    })
  }

  return wrapper
}