import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";


export function logicAnd<T = any>(...args: MaybeRefOrGetter<T>[]): ComputedRef<boolean> {
  return computed(() => args.every(v => toValue(v)))
}