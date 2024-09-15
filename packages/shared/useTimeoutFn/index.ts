import { ref } from "vue";
import { AnyFn, Fn, MaybeRefOrGetter, Stopable } from "../utils";
import { toValue } from "../toValue";

export interface UseTimeoutFnOptions {
  immediate?: boolean;
}

export function useTimeoutFn<CallbackFn extends AnyFn>(cb: CallbackFn, interval: MaybeRefOrGetter<number>, options: UseTimeoutFnOptions = {}): Stopable<Parameters<CallbackFn> | []> {
  const { immediate = true } = options;
  let isPending = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined;

  function clear() {
    if ( timer ) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  function start(...args: Parameters<CallbackFn> | []) {
    isPending.value = true
    timer = setTimeout(() => {
      cb(...args)
      isPending.value = false
    }, toValue(interval));
  }

  function stop() {
    isPending.value = false
    clear()
  }

  if ( immediate )
    start()

  return {
    isPending,
    start,
    stop
  }
}