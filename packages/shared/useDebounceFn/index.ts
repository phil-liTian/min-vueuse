import { createFilterWrapper, debounceFilter, DebounceFilterOptions, FunctionArgs, MaybeRefOrGetter } from '@mini-vueuse/shared'


export function useDebounceFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeRefOrGetter<number> = 2000,
  options: DebounceFilterOptions = {}
) {
  return createFilterWrapper(
    debounceFilter(ms, options),
    fn,
  )
}