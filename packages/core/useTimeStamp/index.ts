import { Pausable, useIntervalFn } from "@mini-vueuse/shared";
import { ref, Ref } from "vue";
import { useRafFn } from "../useRafFn";

export interface UseTimeStampOptions<Controls extends boolean> {
  controls?: Controls;

  interval?: number | 'requestAnimationFrame';

  immediate?: boolean;

  callback?: (timestamp: number) => void;
}

export interface UseTimeStampReturn extends Pausable {
  timestamp: Ref<number>;
}

export function useTimeStamp(options?: UseTimeStampOptions<false>): Ref<number>
export function useTimeStamp(options: UseTimeStampOptions<true>): UseTimeStampReturn

export function useTimeStamp(options: UseTimeStampOptions<boolean> = {}) {
  const { controls: exposeControl, callback, interval = 'requestAnimationFrame' } = options
  const timestamp = ref<number>(Date.now())

  const cb = () => {
    timestamp.value = Date.now()
    callback && callback(timestamp.value)
  }
  
  const controls: Pausable = interval === 'requestAnimationFrame' ? useRafFn(cb, options) : useIntervalFn(cb, interval, options)

  if ( exposeControl ) {
    return {
      timestamp,
      ...controls
    }
  }

  return timestamp

}