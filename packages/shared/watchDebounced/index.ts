import { WatchOptions } from "vue";
import { debounceFilter, DebounceFilterOptions, MaybeRefOrGetter } from "../utils";
import { watchWithFilter } from "../watchWithFilter";

export interface WatchDebouncedOptions<Immediate> extends WatchOptions<Immediate>, DebounceFilterOptions {
  debounce?: MaybeRefOrGetter<number>
}

export function watchDebounced<Immediate extends Readonly<boolean> = false>(
  source: any,
  cb: any,
  options: WatchDebouncedOptions<Immediate> = {}
) {
  const {
    debounce = 0,
    maxWait = undefined,
    ...watchOptions
  } = options


  return watchWithFilter(source, cb, {
    eventFilter: debounceFilter(debounce, { maxWait }),
    ...watchOptions
  })
}