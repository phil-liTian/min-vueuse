import { Ref, ShallowRef, WritableComputedRef, ComputedRef, WatchOptions } from 'vue'

export type Fn = () => void

export type AnyFn = (...args: any[]) => any

// 允许ref类型设置成null和undefined
export type RemovableRef<T> = Omit<Ref<T>, 'value'> & {
  get value(): T
  set value(value: T | undefined | null)
}

export type Arrayable<T> = T | T[]

export type MaybeRef<T = any> = T | Ref<T> | ShallowRef<T> | WritableComputedRef<T>

export type MaybeRefOrGetter<T = any> = MaybeRef<T> | ComputedRef<T> | (() => T)

export type ReadonlyRefOrGetter<T> = ComputedRef<T> | (() => T)

export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never


export type Promisify<T> = Promise<T>


// 可中断、可恢复
export interface Pausable {
  isActive: Ref<boolean>;
  pause: Fn;
  resume: Fn;
}

export interface Stopable<StartFnArgs extends any[] = any[]> {
  isPending: Readonly<Ref<boolean>>;

  stop: Fn;

  start: (...args: StartFnArgs) => void
}




export interface ConfigurableFlush {
  flush?: WatchOptions['flush']
}


