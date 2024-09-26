import { noop, toValue } from '@mini-vueuse/shared'
import { computed, isRef, ref, Ref, shallowRef, watchEffect } from 'vue'

type AsyncComputedCancel = () => void

export type ComputedAsyncOptions = {
  lazy?: boolean

  evaluating?: Ref<boolean>

  shallow?: boolean

  onError?: (e) => void
}

export function computedAsync<T>(
  evaluationCallback: (onCancel: AsyncComputedCancel) => T | Promise<T>,
  inititalState?: T,
  optionsOrRef: ComputedAsyncOptions | Ref<boolean> = {}
): Ref<T> {
  let options: ComputedAsyncOptions
  if (isRef(optionsOrRef)) {
    options = {
      evaluating: optionsOrRef
    }
  } else {
    options = optionsOrRef
  }

  const { lazy = false, shallow = true, onError = noop, evaluating = undefined } = options
  const current = ref(shallow ? shallowRef(inititalState) : ref(inititalState)) as Ref<T>

  const started = ref(!lazy)

  watchEffect(async (onInvalidate) => {
    if (!started.value) return
    console.log('e', evaluating)

    // 传进来的ref 无论是true/false 都会走到当前逻辑
    if (evaluating) {
      Promise.resolve().then(() => {
        evaluating.value = true
      })
    }

    try {
      const result = await evaluationCallback(() => {
        if (evaluating) evaluating.value = false
      })
      current.value = result
    } catch (e) {
      onError(e)
    } finally {
      if (evaluating) evaluating.value = false
    }
  })
  if (lazy) {
    return computed(() => {
      started.value = true
      return current.value
    })
  } else {
    return current
  }
}
