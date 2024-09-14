import { describe, expect, it, vi } from "vitest";
import { useThrottleFn } from ".";
import { promiseTimeout } from "../utils";

describe('useThrottleFn', () => {
  it('should work', async () => {
    const cb = vi.fn()
    const ms = 20
    const run = useThrottleFn(cb, ms)
    run()
    run()
    expect(cb).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    run()
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with trailing', async () => {
    const cb = vi.fn()
    const ms = 20
    const run = useThrottleFn(cb, ms, { trailing: true })
    run()
    run()
    expect(cb).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    run()
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with leading', async () => {
    const callback = vi.fn()
    const ms = 20
    const run = useThrottleFn(callback, ms, { trailing: false, leading: false })
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(ms + 10)
    run()
    run()
    run()
    expect(callback).toHaveBeenCalledTimes(2)
    await promiseTimeout(ms + 20)
    run()
    expect(callback).toHaveBeenCalledTimes(2)
  })
})