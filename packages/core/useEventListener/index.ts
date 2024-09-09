import { unRefElement } from '../unrefElement'
import type { Fn, Arrayable, MaybeRefOrGetter, AnyFn } from '@mini-vueuse/shared'
import { noop, toValue, tryOnScopeDispose } from '@mini-vueuse/shared'
import { watch } from 'vue'
import { defaultWindow } from '../_configurable'

export interface InferEventTarget<T> {
  addEvenetListner: (event: T, fn?: AnyFn, options?: AddEventListenerOptions) => any
  removeEvenetListner: (event: T, fn?: AnyFn, options?: AddEventListenerOptions) => any
}

export function useEventListener<E extends keyof WindowEventMap>(
  events: Arrayable<E>, 
  listeners: Arrayable<Function>,
  options: MaybeRefOrGetter<AddEventListenerOptions | boolean>,
): Fn

export function useEventListener<E extends keyof WindowEventMap>(
  event: Arrayable<E>, 
  listener: Arrayable<AnyFn>, 
  options?: MaybeRefOrGetter
): Fn

export function useEventListener<Names extends string>(
  target: MaybeRefOrGetter<InferEventTarget<Names> | null | undefined>,
  events: Arrayable<Names>,
  listener: Arrayable<AnyFn>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): Fn


export function useEventListener(...args: any[]): Fn {
  let target: MaybeRefOrGetter<EventTarget> | undefined | null;
  let events: Arrayable<string>;
  let listeners: Arrayable<AnyFn>;
  let options: MaybeRefOrGetter<AddEventListenerOptions | boolean>
  
  // 说明没有指定target了
  if (typeof args[0] === 'string' || Array.isArray(args[0]) ) {
    [events, listeners, options] = args
    target = defaultWindow
  } else {
    [target, events, listeners, options] = args
  }

  if (!target) {
    return noop
  }

  // 可一次注册多个事件
  if ( !Array.isArray(events) ) {
    events = [events]
  } 
  if ( !Array.isArray(listeners) ) {
    listeners = [listeners]
  }

  let cleanUps: Function[] = []

  const cleanup = () => {
    cleanUps.map(cleanup => cleanup())
    cleanUps.length = 0
  }

  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options)

    return () => el.removeEventListener(event, listener, options)
  }

  const stopWatch = watch(() => [unRefElement<any>(target), toValue(options)], ([el]) => {
    
    cleanup()
    if ( !el ) return
    cleanUps.push(
      ...(events as string[]).flatMap(event => {
        return (listeners as Function[]).map(listener => {
          return register(el, event, listener, options)
        })
      })
    )
  },
  { immediate: true, flush: 'post' })

  const stop = () => {
    stopWatch()
    cleanup()
  }

  // 如果在非vue组件中使用当前hooks, 可以由开发自定义创建一个effectScope, 但在组件卸载的时候, 不会自动清理当前副作用
  tryOnScopeDispose(stop)

  return stop
}
