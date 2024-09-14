import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";

export function logicNot(v: MaybeRefOrGetter<any>): ComputedRef<boolean> {
  return computed(() => !toValue(v))
}