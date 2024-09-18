import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from 'vue'
import { watchPausable } from ".";

describe('watchPausable', () => {
  it('should work', async () => {
    const num = ref(1)
    const cb = vi.fn()

    const { stop, isActive, resume, pause } = watchPausable(num, cb)

    expect(isActive.value).toBe(true)

    pause()
    num.value++
    await nextTick()
    expect(isActive.value).toBeFalsy()
    expect(cb).toBeCalledTimes(0)

    resume()
    num.value++
    await nextTick()
    expect(isActive.value).toBeTruthy()
    expect(cb).toBeCalledTimes(1)

    stop()
    num.value = 4
    expect(isActive.value).toBeTruthy()
    expect(cb).toBeCalledTimes(1)
  })
})