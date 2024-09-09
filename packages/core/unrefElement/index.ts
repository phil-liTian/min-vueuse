import { toValue } from "@mini-vueuse/shared/toValue";
import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'

type VueInstance = ComponentPublicInstance
type MaybeElement = HTMLElement | VueInstance | null | undefined
type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>

export function unRefElement<T extends MaybeElement>(elRef: MaybeComputedElementRef<T>) {
  const plain = toValue(elRef)

  return (plain as VueInstance)?.$el ?? plain
}