import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";

export function useCeil(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed(() => Math.ceil(toValue(value)))
}