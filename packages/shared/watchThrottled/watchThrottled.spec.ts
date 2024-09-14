import { describe, expect, it, vi } from "vitest";
import { watchThrottled } from ".";
import { nextTick, ref } from "vue";
import { promiseTimeout } from "../utils";

describe('watchThrottled', () => {
  it('should work', async () => {
    const cb = vi.fn()
    const v = ref(0)
    watchThrottled(v, cb, { throttle: 100 })
    v.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())

    v.value = 2
    await promiseTimeout(50)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())

    v.value = 3
    await promiseTimeout(120)
    // expect(cb).toHaveBeenCalledTimes(2)
    // expect(cb).toHaveBeenCalledWith(3, 2, expect.anything())
  })
})