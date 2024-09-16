import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";

export function useArrayFilter<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>, 
  fn: (element: T, index: number, array: T[]) => boolean ): 
  ComputedRef<T[]> {

  return computed(() => toValue(list).map(i => toValue(i)).filter(fn))
}