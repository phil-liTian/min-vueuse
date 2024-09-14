import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";
import { MaybeComputedRefArgs, toValueArgsFlat } from "../utils";

export function useSum(...args: MaybeComputedRefArgs<number>): ComputedRef<number> {
  return computed(() => toValueArgsFlat(args).reduce((acc, cur) => acc + toValue(cur), 0))
}