import { WatchOptions } from "vue";
import { MaybeRefOrGetter, throttleFilter, ThrottleFilterOptions } from "../utils";
import { watchWithFilter } from "../watchWithFilter";

export interface UseWatchThrottledOptions<Immediate> extends ThrottleFilterOptions, WatchOptions<Immediate> {
  throttle?: MaybeRefOrGetter<number>
}


export function watchThrottled<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: UseWatchThrottledOptions<Immediate> = {}
) {
  const {
    throttle = 20,
    trailing = false,
    leading = true,
    ...watchOptions
  } = options
  

  return watchWithFilter(source, cb, {
    ...watchOptions,
    eventFilter: throttleFilter(throttle, { trailing, leading }),
  })
}