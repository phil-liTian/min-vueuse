import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { MaybeElement } from "../unrefElement";
import { Position } from "../types";
import { ref } from "vue";

export interface UseDraggableOptions {
  initialValue?: MaybeRefOrGetter<Position>
}


export function useDraggable(
  target: MaybeRefOrGetter<MaybeElement>,
  options: UseDraggableOptions = {}
) {
  const {
    initialValue
  } = options


  const position = ref<Position>(
    toValue(initialValue) ?? { x: 0, y: 0 }
  )


  return {}
}
