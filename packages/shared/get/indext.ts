import { unref } from 'vue';
import { MaybeRef } from '../utils/types';

/**
 * ref.value
 * @param obj
 */

export function get<T>(obj: MaybeRef<T>): T;
export function get<T, K extends keyof T>(obj: MaybeRef<T>, key: K): T[K];

export function get(obj: MaybeRef<any>, key?: string | number | symbol) {
  if (key === undefined) {
    return unref(obj);
  }

  return unref(obj)[key];
}
