import { Ref, ref } from "vue";
import { MaybeRefOrGetter, Pausable } from "../utils";
import { useIntervalFn } from '@mini-vueuse/shared'


export interface UseIntervalOptions<Control extends boolean> {
  controls?: Control;

  immediate?: boolean;

  callback?: (counter: number) => void;
}

export function useInterval(interval: MaybeRefOrGetter<number>, options?: UseIntervalOptions<false>): Ref<number>

export function useInterval(interval: MaybeRefOrGetter<number>, options: UseIntervalOptions<true>): Pausable & { counter: Ref<number>, reset: () => void }

export function useInterval(interval: MaybeRefOrGetter<number> = 1000, options: UseIntervalOptions<boolean> = {}) {
  const { controls: exposeControls = false, immediate = true, callback } = options

  const counter = ref(0)

  const update = () => counter.value++

  const controls = useIntervalFn( callback ? () => {
      update()
      callback(counter.value)
    } : update
  , interval, options)

  function reset() {
    counter.value = 0
  }

  if ( exposeControls ) {
    return {
      ...controls,
      counter,
      reset
    }
  }

  return counter
}
