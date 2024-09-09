import { ref } from "vue";
import { Fn, MaybeRefOrGetter, Pausable } from "../utils/types";
import { toValue } from "../toValue";
import { tryOnScopeDispose } from "../tryOnScopeDispose";

export interface UseIntervalOptions {
  immediate?: boolean
  immediateCallback?: boolean
}

export function useIntervalFn(cb: Fn, interval: MaybeRefOrGetter<number> = 1000, options: UseIntervalOptions = {}): Pausable {
  const { immediate = true, immediateCallback = false } = options
  const isActive = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function resume() {
    const intervalValue = toValue(interval)
    if ( intervalValue <= 0 ) return
    isActive.value = true
    if ( immediateCallback ) cb()
    clean()
    timer = setInterval(cb, intervalValue);
  }

  function clean() {
    if ( timer ) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() {
    isActive.value = false
    clean()
  }

  if ( immediate ) {
    resume()
  }
  
  tryOnScopeDispose(pause)


  return {
    isActive,
    pause,
    resume
  }
}