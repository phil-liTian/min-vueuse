import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { computed, ComputedRef } from 'vue'

function uniq<T>(array: T[]) {
  return Array.from(new Set(array))
}

function uniqueElementBy<T>(arr: T[], fn: (a: T, b: T) => boolean) {
  return arr.reduce<T[]>((pre, cur) => {
    if (!pre.some((x) => fn(x, cur))) pre.push(cur)
    return pre
  }, [])
}

export function useArrayUnique<T>(
  list: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  compareFn?: (a: T, b: T) => boolean
): ComputedRef<T[]> {
  return computed(() => {
    const resolvedList = toValue(list).map((v) => toValue(v))
    return compareFn ? uniqueElementBy(resolvedList, compareFn) : uniq(resolvedList)
  })
}
