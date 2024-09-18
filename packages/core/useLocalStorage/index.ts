import { MaybeRefOrGetter, RemovableRef } from "@mini-vueuse/shared";
import { useStorage, UseStorageOptions } from "../useStorage";
import { defaultWindow } from "../_configurable";

export function useLocalStorage(key: string, initialValue: MaybeRefOrGetter<string>, options: UseStorageOptions<string>): RemovableRef<string> 
export function useLocalStorage(key: string, initialValue: MaybeRefOrGetter<number>, options: UseStorageOptions<number>): RemovableRef<number> 
export function useLocalStorage(key: string, initialValue: MaybeRefOrGetter<boolean>, options: UseStorageOptions<boolean>): RemovableRef<boolean> 
export function useLocalStorage<T>(key: string, initialValue: MaybeRefOrGetter<T>, options?: UseStorageOptions<T>): RemovableRef<T> 
export function useLocalStorage<T = unknown>(key: string, initialValue: MaybeRefOrGetter<null>, options: UseStorageOptions<T>): RemovableRef<T> 


export function useLocalStorage<T extends (number | object | null | string)>(
  key: string, 
  initialValue: MaybeRefOrGetter<T>, 
  options: UseStorageOptions<T> = {}
): RemovableRef<T> {
  const { window = defaultWindow } = options
  return useStorage(key, initialValue, window?.localStorage, options)
}
