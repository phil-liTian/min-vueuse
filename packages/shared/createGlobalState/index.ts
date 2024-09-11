import { effectScope } from "vue";
import { AnyFn} from "../utils/types";

export function createGlobalState<Fn extends AnyFn>(stateFactory: Fn): Fn {
  let initialized = false
  let state: any
  const scope = effectScope()

  return ((...args: []) => {
    if ( !initialized ) {
      state = scope.run(() => stateFactory(...args))
      initialized = true
    }
    
    return state
  }) as Fn
}