import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";


export type ProjectorFunction<F, T> = (input: F, from: readonly [F, F], to: readonly [T, T]) => T


export type CreateGenericProjectionReturn<F, T> = (input: MaybeRefOrGetter<F>) => ComputedRef<T>

export function createGenericProjection<F = number, T = number>(
  fromDomain: MaybeRefOrGetter<readonly [F, F]>, 
  toDomain: MaybeRefOrGetter<readonly [T, T]>,
  projector: ProjectorFunction<F, T>
): CreateGenericProjectionReturn<F, T> {
  
  return (input: MaybeRefOrGetter<F>) => computed(() => projector(toValue(input), toValue(fromDomain), toValue(toDomain)))

}