import { containsProp, isObject, MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { M } from "vitest/dist/chunks/environment.0M5R1SX_";
import { computed, ComputedRef } from "vue";

export type UseArrayIncludesComparatorFn<T, V = any> = ((element: T, value: V, index: number, array: MaybeRefOrGetter<T>[]) => boolean)


function isArrayIncludesOptions(obj: any) {
  return isObject(obj) && containsProp(obj, 'comparator', 'fromIndex')
}

export function useArrayIncludes<T, V = any>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  value: MaybeRefOrGetter<V>,
  comparator?: UseArrayIncludesComparatorFn<T, V> | string | { comparator?: UseArrayIncludesComparatorFn<T, V>, fromIndex?: number }
): ComputedRef<boolean>

export function useArrayIncludes<T, V = any>(...args: any[]): ComputedRef<boolean> {
  const list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]> = args[0]
  const value: MaybeRefOrGetter<V> = args[1]
  let comparator: UseArrayIncludesComparatorFn<T, V> = args[2]
  let fromIndex = 0

  if ( typeof comparator === 'string' ) {
    // return computed(() => toValue(list).some(element => toValue(element)[comparator] === toValue(value)))
    const key = comparator as keyof T
    comparator = (element: T, value: V) => toValue(element)[key] === toValue(value)
  }

  if ( isArrayIncludesOptions(args[2]) ) {
    comparator = args[2].comparator
    fromIndex = args[2].fromIndex
  }

  // 默认透传comparator, 值类型比较
  comparator = comparator ?? ((element: T, value: T) => toValue(element) === toValue(value))

  return computed(() => toValue(list)
    .slice(fromIndex)
    .some(
    (element, index, array) => comparator(toValue(element), toValue(value), index, toValue(array))))
}