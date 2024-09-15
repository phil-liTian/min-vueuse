import { MaybeRefOrGetter } from "@mini-vueuse/shared";
import { ProjectorFunction } from "../createGenericProjection";
import { createProjection, defaultProjector } from "../createProjection";


export function useProjection(
  input: MaybeRefOrGetter<number>,
  fromDomain: MaybeRefOrGetter<readonly [number, number]>, 
  toDomain: MaybeRefOrGetter<readonly [number, number]>,
  projector: ProjectorFunction<number, number> = defaultProjector
) {
  return createProjection(fromDomain, toDomain, projector)(input)
}