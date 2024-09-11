import { Pausable } from "@mini-vueuse/shared";
import { ConfigableWindow, defaultWindow } from "../_configurable";
import { readonly, ref } from "vue";

export interface UseRafFnCallbackArguments {
  // 当前帧和上一帧的间隔时间
  delta: number;

  timeStamp: DOMHighResTimeStamp
}


export interface UseRafFnOptions extends ConfigableWindow {
  immediate?: boolean;

  fpsLimit?: number
}

export function useRafFn(fn: (args: UseRafFnCallbackArguments) => void, options: UseRafFnOptions = {}): Pausable {
  const { immediate = true, window = defaultWindow, fpsLimit = undefined } = options
  const isActive = ref(false)
  const intervalLimit = fpsLimit ? fpsLimit / 1000 : null
  let rafId: number | null = null
  let previousFrameTimestamp = 0

  function loop(timeStamp: DOMHighResTimeStamp) {
    if( !isActive.value || !window ) return

    if ( !previousFrameTimestamp ) {
      previousFrameTimestamp = timeStamp
    }

    const delta = timeStamp - previousFrameTimestamp

    if ( intervalLimit && delta < intervalLimit ) {
      rafId = window.requestAnimationFrame(loop)
      return
    }
    previousFrameTimestamp = timeStamp
    fn({ delta, timeStamp })
    rafId = window.requestAnimationFrame(loop)
  }

  function resume() {
    if ( !isActive.value && window ) {
      isActive.value = true
      previousFrameTimestamp = 0
      rafId = window.requestAnimationFrame(loop)
    }
  }

  function pause() {
    isActive.value = false
    if ( rafId !== null && window ) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }


  if ( immediate ) {
    resume()
  }


  return {
    isActive: readonly(isActive),
    resume,
    pause
  }
}

