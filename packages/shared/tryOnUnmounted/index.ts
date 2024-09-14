import { onUnmounted } from "vue";
import { Fn, getLifeCycleTarget } from "../utils";

export function tryOnUnmounted(fn: Fn, target?: any) {
  const instance = getLifeCycleTarget(target)
  if (instance)
    onUnmounted(fn, target)
}