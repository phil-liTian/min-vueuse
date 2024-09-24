import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { computed, ComputedRef } from 'vue'

export function useArrayMap<T, U = T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => U
): ComputedRef<U[]> {
  return computed(() => toValue(list).map((element, index, array) => fn(toValue(element), index, array)))
}
