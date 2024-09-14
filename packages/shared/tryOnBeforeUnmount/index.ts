import { onBeforeUnmount } from "vue";
import { Fn, getLifeCycleTarget } from "../utils";

export function tryOnBeforeUnmount(fn: Fn, target?: any) {
  const instance = getLifeCycleTarget(target)
  console.log('instance', instance);
  
  if ( instance ) 
    onBeforeUnmount(fn, target)
}
