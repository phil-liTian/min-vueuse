import { MaybeRef } from '@mini-vueuse/shared'
import { toValue } from '@mini-vueuse/shared/toValue'
import type { ComponentPublicInstance, MaybeRefOrGetter } from 'vue'

type VueInstance = ComponentPublicInstance
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>
export type MaybeElement = HTMLElement | SVGAElement | VueInstance | null | undefined
export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>

export function unRefElement<T extends MaybeElement>(elRef: MaybeComputedElementRef<T>) {
  const plain = toValue(elRef)

  return (plain as VueInstance)?.$el ?? plain
}
