import { MaybeRefOrGetter, RemovableRef } from "@mini-vueuse/shared";
import { useStorage, UseStorageOptions } from "..";

export function useSessionStorage(key: string, defaults: MaybeRefOrGetter<string>, options: UseStorageOptions<string>): RemovableRef<string>
export function useSessionStorage(key: string, defaults: MaybeRefOrGetter<boolean>, options: UseStorageOptions<boolean>): RemovableRef<boolean>
export function useSessionStorage(key: string, defaults: MaybeRefOrGetter<number>, options: UseStorageOptions<number>): RemovableRef<number>
export function useSessionStorage<T>(key: string, defaults: MaybeRefOrGetter<T>, options?: UseStorageOptions<T>): RemovableRef<number>

export function useSessionStorage<T extends (number | string | object | null | boolean)>(
  key: string, 
  defaults: MaybeRefOrGetter<T>,
  options: UseStorageOptions<T> = {}): RemovableRef<T> {
  
  return useStorage(key, defaults, window?.sessionStorage, options)
}