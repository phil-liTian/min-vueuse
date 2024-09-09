import { computed, ComputedRef } from 'vue'
import { MaybeComputedRefArgs, toValueArgsFlat } from "../utils";
import { MaybeRef, MaybeRefOrGetter } from '../../shared';

export function useMax(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>
export function useMax(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>

export function useMax(...args: MaybeComputedRefArgs<number>): ComputedRef<number> {
  return computed<number>(() => {
    const array = toValueArgsFlat(args)
    return Math.max(...array)
  })
}
