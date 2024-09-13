import { watch, WatchCallback, WatchOptions, WatchSource, WatchStopHandle } from "vue";
import { byPassFilter, ConfigableEventFilter, createFilterWrapper } from "../utils/filters";
import { MaybeRefOrGetter } from "../utils";

export interface WatchWithFilterOptions<Immediate> extends WatchOptions<Immediate>, ConfigableEventFilter {}

export function watchWithFilter<T, Immediate extends Readonly<boolean> = false>(source: WatchSource<T>, cb: WatchCallback<T, Immediate extends true ? T | undefined : T>, options: WatchWithFilterOptions<Immediate>): WatchStopHandle

export function watchWithFilter<Immediate extends boolean = false>(
  source: any,
  cb: any,
  options: WatchWithFilterOptions<Immediate> = {}
) {
  const {
    eventFilter = byPassFilter,
    ...watchOptions
  } = options
  
  return watch(source, createFilterWrapper(
    eventFilter,
    cb
  ), watchOptions)
  
}
