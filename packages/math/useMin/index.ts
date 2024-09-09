import { computed, ComputedRef } from 'vue'
import { MaybeComputedRefArgs, toValueArgsFlat } from "../utils";
import { MaybeRefOrGetter } from '../../shared';

export function useMin(...args: MaybeRefOrGetter<number>[]): ComputedRef<number>
export function useMin(array: MaybeRefOrGetter<MaybeRefOrGetter<number>[]>): ComputedRef<number>

export function useMin(...args: MaybeComputedRefArgs<number>): ComputedRef<number> {
  return computed<number>(() => {
    const array = toValueArgsFlat(args)
    return Math.min(...array)
  })
}
