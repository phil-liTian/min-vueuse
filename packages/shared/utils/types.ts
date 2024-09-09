import { Ref, ShallowRef, WritableComputedRef, ComputedRef } from 'vue'

export type Fn = () => void

export type AnyFn = (...args: any[]) => any

export type Arrayable<T> = T | T[]

export type MaybeRef<T = any> = T | Ref<T> | ShallowRef<T> | WritableComputedRef<T>

export type MaybeRefOrGetter<T = any> = MaybeRef<T> | ComputedRef<T> | (() => T)


export interface Pausable {
  isActive: Ref<boolean>;
  pause: Fn;
  resume: Fn;
}
