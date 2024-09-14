import { computed, ComputedRef } from "vue";
import { MaybeComputedRefArgs, toValueArgsFlat } from "../utils";
import { toValue } from "@mini-vueuse/shared";

export function useAverage(...args: MaybeComputedRefArgs<number>): ComputedRef<number> {
  return computed(() => {
    const array = toValueArgsFlat(args)
    return array.reduce((acc, cur) => acc + toValue(cur), 0) / array.length
  })
}