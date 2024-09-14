import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";

export function logicOr(...args: MaybeRefOrGetter<any>[]) {
  return args.some(i => toValue(i))
}