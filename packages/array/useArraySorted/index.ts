import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { computed, Ref, watchEffect } from 'vue'

export type UseSortedCompareFn<T = any> = (a: T, b: T) => number

export type UseSortedFn<T = any> = (arr: T[], compareFn: UseSortedCompareFn<T>) => T[]

const defaultCompare: UseSortedCompareFn<number> = (a, b) => a - b
const defaultSortFn: UseSortedFn = (arr, compareFn) => arr.sort(compareFn)

export interface UseSortedOptions {
  sortFn?: UseSortedFn
  compareFn?: UseSortedCompareFn
  dirty?: boolean
}

export function useArraySorted<T = any>(source: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>): Ref<T[]>

export function useArraySorted<T = any>(
  source: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  options?: UseSortedOptions
): Ref<T[]>

export function useArraySorted<T = any>(
  source: MaybeRefOrGetter<MaybeRefOrGetter<T>[]>,
  compareFn?: UseSortedCompareFn<T>,
  options?: Omit<UseSortedOptions, 'compareFn'>
): Ref<T[]>

export function useArraySorted(...args: any[]) {
  const [source] = args
  let compareFn: UseSortedCompareFn = defaultCompare
  let options: UseSortedOptions = {}
  if (args.length === 2) {
    if (typeof args[1] === 'object') {
      options = args[1]
      compareFn = options.compareFn || defaultCompare
    } else {
      compareFn = args[1] ?? defaultCompare
    }
  } else if (args.length > 2) {
    options = args[2] || {}
    compareFn = args[1] ?? defaultCompare
  }

  const { sortFn = defaultSortFn, dirty = false } = options
  if (!dirty) {
    return computed(() => sortFn([...toValue(source)], compareFn))
  }

  watchEffect(() => {
    const result = sortFn(toValue(source), compareFn)
  })

  return source
}
