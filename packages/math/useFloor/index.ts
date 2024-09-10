import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";

export function useFloor(value: MaybeRefOrGetter<number>): ComputedRef<number> {
  return computed(() => Math.floor(toValue(value)))
}