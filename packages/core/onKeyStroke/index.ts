import { MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export type KeyFilter = string | string[] | true | ((event: KeyboardEvent) => string)

export type KeyStrokeEventName = 'keyup' | 'keydown' | 'keypress'

export type OnKeyStrokeOptions  = {
  eventName?: KeyStrokeEventName

  target?: MaybeRefOrGetter<EventTarget | null | undefined>;

  // 重复点击相同的key, 是否触发handler
  dedupe?: MaybeRefOrGetter<boolean>
}

function createKeyPredicate(keyFilter: KeyFilter) {
  if ( typeof keyFilter === 'string' ) {
    return (event: KeyboardEvent) => event.key === keyFilter
  } else if ( Array.isArray(keyFilter) ) {
    return (event: KeyboardEvent) => keyFilter.includes(event.key)
  } else if ( typeof keyFilter === 'function' ) {
    return keyFilter
  }

  return () => true
}

export function onKeyStroke(...args: any[]) {
  let key: KeyFilter
  let handler: (event: KeyboardEvent) => void
  let options: OnKeyStrokeOptions = {}

  if ( args.length === 3 ) {
    [key, handler, options] = args
  } else if (args.length === 2) {
    if ( typeof args[1] === 'object' ) {
      key = true
      handler = args[0]
      options = args[1]
    } else {
      [key, handler] = args
    }
  } else {
    key = true
  }
  
  const { 
    target = defaultWindow,
    eventName = 'keydown',
    dedupe = false
  } = options

  const predicate = createKeyPredicate(key)

  const listener = (e: KeyboardEvent) => {
    if ( toValue(dedupe) && e.repeat ) {
      return
    }

    // 放行条件
    if ( predicate(e) ) {
      handler(e)
    }
  }

  return useEventListener(target, eventName, listener)
}


export function onKeyDown(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<OnKeyStrokeOptions, 'eventName'>) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keydown' })
}

export function onKeyUp(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<OnKeyStrokeOptions, 'eventName'>) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keyup' })
}

export function onKeyPress(key: KeyFilter, handler: (event: KeyboardEvent) => void, options: Omit<OnKeyStrokeOptions, 'eventName'>) {
  return onKeyStroke(key, handler, { ...options, eventName: 'keypress' })
}

