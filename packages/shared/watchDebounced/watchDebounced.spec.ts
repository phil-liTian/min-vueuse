import { describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import { watchDebounced } from ".";
import { promiseTimeout } from "../utils";

describe('watchDebounced', () => {
  it('should work with default', async () => {
    const num = ref(0)
    const cb = vi.fn()

    watchDebounced(num, cb)
    num.value = 1
    await promiseTimeout(10)
    // expect(cb).toBeCalledTimes(1)
    expect(cb).toHaveBeenCalledWith(1, 0, expect.anything())
  })


  it('should work when set debounce and maxWait', async () => {
    const num = ref(0)
    const cb = vi.fn()
    watchDebounced(num, cb, { debounce: 100, maxWait: 150 })

    num.value = 1
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(0)

    num.value = 2
    await promiseTimeout(50)
    expect(cb).toHaveBeenCalledTimes(0)

    await promiseTimeout(50)
    expect(cb).toHaveBeenCalledWith(2, 1, expect.anything())

    num.value = 4
    await promiseTimeout(80)
    expect(cb).toHaveBeenCalledTimes(1)

    num.value = 5
    await promiseTimeout(75)
    expect(cb).toHaveBeenCalledTimes(2)
    expect(cb).toHaveBeenCalledWith(4, 2, expect.anything())
  })
})