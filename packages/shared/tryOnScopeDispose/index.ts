import { getCurrentScope, onScopeDispose } from "vue";
import { Fn } from "../utils/types";

export function tryOnScopeDispose(fn: Fn) {
  if (getCurrentScope()) onScopeDispose(fn)
}