import { Reactive, Ref } from "vue"


export function set<T>(ref: Ref<T>, key: T ): void
export function set<O extends object, K extends keyof O>(target: Reactive<O>, key: K , value: O[K]): void

// ref.value = x
export function set(...args: any[]) {
  if (args.length === 2)  {
    const [ ref, value ] = args
    ref.value = value
  }

  if ( args.length === 3 ) {
    const [ target, key, value ] = args
    target[key] = value
  }
} 