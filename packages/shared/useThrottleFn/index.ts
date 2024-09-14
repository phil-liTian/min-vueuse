import { ConfigableEventFilter, createFilterWrapper, Fn, MaybeRefOrGetter, byPassFilter, ThrottleFilterOptions, throttleFilter, FunctionArgs } from "../utils";


export function useThrottleFn<T extends FunctionArgs>(
  fn: T, 
  ms: MaybeRefOrGetter<number> = 20, 
  options: ThrottleFilterOptions = {}) {

  return createFilterWrapper(
    throttleFilter(ms, options),
    fn
  )
}
