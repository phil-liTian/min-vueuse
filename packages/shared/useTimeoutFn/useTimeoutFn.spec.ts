import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useTimeoutFn } from ".";
import { promiseTimeout } from "../utils";

describe('useTimeoutFn', () => {
  it('should work', async () => {
    const interval = ref(0)
    const cb = vi.fn()
    const { start, stop } = useTimeoutFn(cb, interval)
    start()
    await promiseTimeout(1)
    expect(cb).toHaveBeenCalled()
    cb.mockReset()
    interval.value = 100
    start()
    await promiseTimeout(50)
    expect(cb).not.toHaveBeenCalled()
    await promiseTimeout(100)
    expect(cb).toBeCalled()
  })

  it('should get pending status', async () => {
    const cb = vi.fn()
    const { isPending, start, stop } = useTimeoutFn(cb, 0, { immediate: false })
    expect(isPending.value).toBe(false)
    expect(cb).not.toBeCalled()

    start()
    expect(isPending.value).toBe(true)
    expect(cb).not.toBeCalled()

    await promiseTimeout(1)

    expect(isPending.value).toBe(false)
    expect(cb).toBeCalled()
  })
})