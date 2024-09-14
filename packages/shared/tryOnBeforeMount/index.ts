import { Fn, getLifeCycleTarget } from "../utils";
import { nextTick, onBeforeMount } from 'vue'

export function tryOnBeforeMount(fn: Fn, sync = true) {
  const instance = getLifeCycleTarget()
  if(instance)
    onBeforeMount(fn)
  else if ( sync ) 
    fn()
  else 
    nextTick(fn)
}
