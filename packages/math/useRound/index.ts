import { toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef, MaybeRefOrGetter } from "vue";

export function useRound(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed(() => Math.round(toValue(value)))
}