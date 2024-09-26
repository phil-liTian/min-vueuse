import { describe, expect, it, vi } from 'vitest'
import { computedAsync } from '.'
import { computed, nextTick, ref } from 'vue'
import { promiseTimeout } from '@mini-vueuse/shared'

describe('computed', () => {
  it('it lazy', () => {
    const func = vi.fn(() => 1)
    const data = computed(func)

    expect(func).not.toHaveBeenCalled()

    expect(data.value).toBe(1)
    expect(func).toHaveBeenCalled()
  })
})

describe('computedAsync', () => {
  it('it not lazy by default', async () => {
    const func = vi.fn(() => Promise.resolve('data'))
    const data = computedAsync(func)
    expect(func).toHaveBeenCalled()
    expect(data.value).toBeUndefined()
    await promiseTimeout(10)
    expect(data.value).toBe('data')
  })

  it('call onError when throw error', async () => {
    let errorMsg
    const func = vi.fn(async () => {
      throw new Error('error')
    })

    const data = computedAsync(func, undefined, {
      onError: (e) => {
        errorMsg = e.message
      }
    })

    expect(func).toHaveBeenCalled()
    expect(data.value).toBeUndefined()

    await promiseTimeout(10)
    expect(errorMsg).toBe('error')
  })

  it('should set lazy to true', async () => {
    const func = vi.fn(async () => 'data')
    const data = computedAsync(func, undefined, { lazy: true })
    expect(func).not.toHaveBeenCalled()
    // 此处必须要先获取值 才能触发getter
    expect(data.value).toBeUndefined()

    await promiseTimeout(10)
    expect(func).toHaveBeenCalled()
    expect(data.value).toBe('data')
  })

  it('should re-computed when dependency changed', async () => {
    const counter = ref(1)
    const double = computedAsync(() => {
      const result = counter.value * 2
      return Promise.resolve(result)
    })
    expect(double.value).toBeUndefined()
    await nextTick()
    expect(double.value).toBe(2)

    counter.value = 2
    await nextTick()
    expect(double.value).toBe(4)
  })

  it('should use last result', async () => {
    const evaluating = ref(false)
    const counter = ref(1)
    const resolutions: Array<() => void> = []

    const double = computedAsync(
      () => {
        const result = counter.value * 2
        return new Promise((resolve) => resolutions.push(() => resolve(result)))
      },
      undefined,
      evaluating
    )

    await nextTick()
    expect(double.value).toBeUndefined()
    expect(evaluating.value).toBe(true)
    expect(resolutions).toHaveLength(1)

    resolutions[0]()
    await nextTick()
    expect(double.value).toBe(2)
    expect(evaluating.value).toBe(false)

    counter.value = 2
    await nextTick()
    counter.value = 3
    await nextTick()
    counter.value = 4
    await nextTick()

    expect(evaluating.value).toBe(true)
    expect(resolutions).toHaveLength(4)

    resolutions[1]()
    await nextTick()
    await nextTick()

    // expect(evaluating.value).toBe(true)
    // expect(double.value).toBe(2)
  })
})
