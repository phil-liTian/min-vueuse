import { MaybeRefOrGetter } from '@mini-vueuse/shared'
import { computed, toValue } from 'vue'

export function useArraySome<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  fn: (element: T, index: number, array: MaybeRefOrGetter<T>[]) => boolean
) {
  return computed(() => toValue(list).some((element, index, array) => fn(toValue(element), index, array)))
}
