import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { isRef, Ref, ref, watch, WatchOptions } from "vue";

export interface UseClonedOptions<T = any> extends WatchOptions {
  // 可自定义clone函数
  clone?: (source: T) => T;

  manual?: boolean
}

export interface UseClonedReturn<T> {
  cloned?: Ref<T>;

  sync: () => void
}

export type CloneFn<F, T = F> = (x: F) => T

export function cloneFnJson<T> (value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export function useCloned<T>(source: MaybeRefOrGetter<T>, options: UseClonedOptions<T> = {}): UseClonedReturn<T> {
  const cloned = ref({} as T) as Ref<T>

  const {
    clone = cloneFnJson,
    manual = false,
    deep = true,
    immediate = true
  } = options
  function sync() {
    cloned.value = clone(toValue(source))
  }

  if ( !manual && (isRef(source) || typeof source === 'function') ) {
    watch(source, sync, {
      ...options,
      immediate,
      deep
    })
  } else {
    // 非响应式的 直接clone
    sync()
  }

  return {
    cloned,
    sync
  }
}