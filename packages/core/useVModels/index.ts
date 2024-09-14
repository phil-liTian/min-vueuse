import { ToRefs } from "vue";
import { useVModel, UseVModelOptions } from "../useVModel";

export function useVModels<P extends object, Name extends string>(
  props: P,
  emit: (name: Name, ...args: any[]) => void,
  options: UseVModelOptions<P, true>
): ToRefs<P>

export function useVModels<P extends object, Name extends string>(
  props: P,
  emit: (name: Name, ...args: any[]) => void,
  options: UseVModelOptions<P, false>
): ToRefs<P>
export function useVModels<P extends object, Name extends string, Passive extends boolean>(
  props: P,
  emit: (name: Name, ...args: any[]) => void,
  options: UseVModelOptions<P, Passive> = {}
): ToRefs<P> {
  let ret: any = {}

  for (const key in props) {
    ret[key] = useVModel(props, key, emit, options as Parameters<typeof useVModel>[3])
  }

  return ret
}
