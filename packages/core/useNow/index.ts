import { useRafFn } from '@mini-vueuse/core'
import { Pausable, useIntervalFn } from '@mini-vueuse/shared';
import { Ref, ref } from 'vue'

export type UseNowInterval = 'requestAnimationFrame' | number

export interface UseNowOptions<T extends boolean> {
  controls?: T;

  interval?: UseNowInterval
}

export function useNow(options?: UseNowOptions<false>): Ref<Date>
export function useNow(options?: UseNowOptions<true>): Pausable & { now: Ref<Date> }

export function useNow(options: UseNowOptions<boolean> = {}) {
  const { controls = false, interval = 'requestAnimationFrame' } = options
  const now = ref(new Date())

  const update = () => now.value = new Date()

  const _controls = interval === 'requestAnimationFrame' ? useRafFn(update) : useIntervalFn(update, interval)

  if ( controls ) {
    return {
      now,
      ..._controls
    }
  }

  return now
}