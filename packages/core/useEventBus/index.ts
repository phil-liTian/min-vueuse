import { getCurrentScope } from 'vue';
import { events } from './internal'

export interface EventBusKey<T> extends Symbol {}
export type EventBusIdentifier<T = unknown> = EventBusKey<T> | string | number;
export type EventBusListener<T = unknown, P = any> = (event: T, payload?: P) => void
export type EventBusEvents<T, P = any> = Set<EventBusListener<T, P>>

export interface UseEventBusReturn<T, P> {
  on: (listener: EventBusListener<T, P>) => void;

  off: (listener: EventBusListener<T, P>) => void;

  once: (listener: EventBusListener<T, P>) => void;

  emit: (event?: T, payload?: P) => void;

  reset: () => void;
}

export function useEventBus<T = unknown, P = any>(key: EventBusIdentifier<T>): UseEventBusReturn<T, P> {
  const scope = getCurrentScope()

  function on(listener: EventBusListener<T, P>) {
    const listeners = (events.get(key) || new Set())
    listeners.add(listener)

    events.set(key, listeners)

    const _off = () => off(listener)
    // @ts-expect-error
    scope?.cleanups?.push(_off)
  }

  function once(listener: EventBusListener<T, P>) {
    function _listener(...args: any[]) {
      off(_listener) // 执行完一次之后就将这个listener移除掉
      // @ts-expect-error
      listener(...args)
    }

    return on(_listener)
  }

  function off(listener: EventBusListener<T, P>) {
    const listeners = events.get(key)
    if ( !listeners ) return
    listeners.delete(listener)

    if ( !listeners.size ) {
      reset()
    }
  }

  function reset() {
    events.delete(key)
  }

  function emit(event?: T, payload?: P) {
    events.get(key)?.forEach(fn => fn(event, payload))
  }

  return {
    on,
    once,
    off,
    emit,
    reset
  }
}
