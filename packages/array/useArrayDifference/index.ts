import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared"
import { computed } from "vue"

const defaultCompareFn = <T>(a: T, b: T) => a === b

export function useArrayDifference<T>(...args: any[]) {
  const list: MaybeRefOrGetter<T[]> = args[0]
  const values: MaybeRefOrGetter<T[]> = args[1]
  let compareFn = args[2] ?? defaultCompareFn

  if ( typeof compareFn === 'string' ) {
    const key = compareFn as keyof T
    compareFn = (a: T, b: T) => a[key] === b[key]
  }


  return computed(() => toValue(list).filter(item => !toValue(values).some(value => compareFn(item, value))))
}
