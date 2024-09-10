import { AnyFn, noop } from "@mini-vueuse/shared";
import { MaybeElementRef, unRefElement } from "../unrefElement";
import { defaultWindow, ConfigableWindow } from '../_configurable'
import { useEventListener } from "../useEventListener";

export interface onClickOutsideOptions extends ConfigableWindow  {
  capture?: boolean;

  igore?: (string | MaybeElementRef)[];
}

export function onClickOutside<T extends onClickOutsideOptions>(
  target: MaybeElementRef,
  handler: AnyFn,
  options: T = {} as T
) {
  const { window = defaultWindow, capture = true, igore = [] } = options

  if ( !window ) return noop

  let shouldListen = true

  const shouldIgnore = (event: PointerEvent) => {
    return igore.some(el => {
      if ( typeof el === 'string' ) {
        if ( !el ) return false;
        
        return Array.from(window.document.querySelectorAll(el)).some(_el => {
          return _el === event.target || _el.contains(event.target as Node)
        })
      } else {
        const _el = unRefElement(el)
        return _el === event.target || _el.contains(event.target as Node)
      }
    })
  }

  const listener = (event: PointerEvent) => {
    const el = unRefElement(target)
    // 点击的元素 是当前target, 则不需要调用handler

    if ( !el || el === event.target || event.composedPath().includes(el) ) return

    if ( event.detail === 0 ) {
      shouldListen = false
    }
    
    if ( !shouldListen ) {
      shouldListen = true
      return
    }

    handler(event)
  }

  const cleanup = [
    useEventListener(window, 'click', listener, { passive: true, capture }),
    useEventListener(window, 'pointerdown', e => {
      const el = unRefElement(target)
      shouldListen = !shouldIgnore(e)
    })
  ]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
