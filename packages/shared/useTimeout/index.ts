import { computed, ComputedRef } from "vue";
import { Fn, MaybeRefOrGetter, Pausable, Stopable } from "../utils";
import { noop, useTimeoutFn } from '../index'

export interface UseTimeoutOptions<Controls extends boolean> {
  controls?: Controls;

  immediate?: boolean;

  callback?: Fn
}


export function useTimeout(interval: MaybeRefOrGetter<number>, options?: UseTimeoutOptions<false>): ComputedRef<boolean>

export function useTimeout(interval: MaybeRefOrGetter<number>, options?: UseTimeoutOptions<true>): Stopable & { ready: ComputedRef<boolean> }

export function useTimeout(interval: MaybeRefOrGetter<number> = 1000, options: UseTimeoutOptions<boolean> = {}) {
  const { controls: exposeControls = false, immediate = false, callback } = options

  const cb = callback || noop

  const controls = useTimeoutFn(cb, interval, options)

  const ready = computed(() => !controls.isPending.value)

  if ( exposeControls ) {
    return {
      ...controls,
      ready
    }
  }

  return ready
}