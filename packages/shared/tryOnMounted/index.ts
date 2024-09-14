import { nextTick, onMounted } from "vue";
import { Fn, getLifeCycleTarget } from "../utils";

export function tryOnMounted(fn: Fn, sync = true, target?: any) {
  const instance = getLifeCycleTarget()
  if ( instance )
    onMounted(fn)
  else if (sync)
    fn()
  else
    nextTick(fn)
}
