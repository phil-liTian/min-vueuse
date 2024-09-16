import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";


export function useArrayFindIndex<T>(list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => boolean): ComputedRef<number> {
  return computed(() => toValue(list).findIndex((element, index, array) => fn(toValue(element), index, array)))
}