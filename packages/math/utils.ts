import { MaybeRefOrGetter, toValue } from "../shared";

export type MaybeComputedRefArgs<T> = MaybeRefOrGetter<T>[] | MaybeRefOrGetter<MaybeRefOrGetter<T>[]>[]

export function toValueArgsFlat<T>(args: MaybeComputedRefArgs<T>): T[] {
  return args.flatMap(arg => {
    const v = toValue(arg)
    if (Array.isArray(v)) return v.map(toValue)

    return v
  })
}

