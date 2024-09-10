import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";

export function useTrunc(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed(() => Math.trunc(toValue(value)))
}