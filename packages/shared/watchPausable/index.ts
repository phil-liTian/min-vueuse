import { WatchStopHandle } from "vue";
import { MaybeRefOrGetter, Pausable, pausableFilter } from "../utils";
import { watchWithFilter, WatchWithFilterOptions } from "../watchWithFilter";

export interface WatchPausable extends Pausable {
  stop: WatchStopHandle
}

export function watchPausable<T, Immediate extends boolean = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {}
) {
  const { eventFilter: filter, ...watchOptions } = options
  
  const { eventFilter, isActive, pause, resume } = pausableFilter(filter)

  const stop = watchWithFilter(source, cb, {
    eventFilter,
    ...watchOptions
  })

  return { stop, isActive, pause, resume }
}
