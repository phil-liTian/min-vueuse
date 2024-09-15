import { MaybeRefOrGetter } from "@mini-vueuse/shared";
import { createGenericProjection, CreateGenericProjectionReturn, ProjectorFunction } from "..";

// : ProjectorFunction<any, any>

/**
 * @param input 
 * @param from 
 * @param to 
 * @returns 
 */

export const defaultProjector = (input: number, from: readonly [number, number], to: readonly [number, number]) => {
  return (input - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0]
}

export function createProjection(
  fromDomain: MaybeRefOrGetter<readonly [number, number]>, 
  toDomain: MaybeRefOrGetter<readonly [number, number]>,
  projector: ProjectorFunction<number, number> = defaultProjector
): CreateGenericProjectionReturn<number, number> {
  return createGenericProjection(fromDomain, toDomain, projector)
}