import { reactify } from "@mini-vueuse/core";

export function useMath<K extends keyof Math>(key: K, ...args: any[]) {

  return reactify((Math[key] as any) as any)(...args)
}