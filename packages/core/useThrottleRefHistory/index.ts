import { MaybeRef, MaybeRefOrGetter, throttleFilter } from "@mini-vueuse/shared";
import { useRefHistory, UseRefHistoryOptions, UseRefHistoryReturn } from "../useRefHistory";
import { Ref } from "vue";

export interface UseThrottleRefHistoryOptions<Raw, Serialized> extends UseRefHistoryOptions<Raw, Serialized> {
  throttle?: MaybeRefOrGetter<number>
}

export interface UseThrottleRefHistoryReturn<Raw, Serialized> extends UseRefHistoryReturn<Raw, Serialized> {}


export function useThrottleRefHistory<Raw, Serialized = Raw>(source: Ref<Raw>, options: UseThrottleRefHistoryOptions<Raw, Serialized> = {}): UseThrottleRefHistoryReturn<Raw, Serialized> {

  const { throttle = 200 } = options

  const filter = throttleFilter(throttle)

  const histroy = useRefHistory(source, { ...options, eventFilter: filter })

  return { ...histroy }
}