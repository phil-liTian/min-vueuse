import { describe, expect, it, vi } from "vitest";
import { useInterval } from ".";
import { promiseTimeout } from "../utils";


describe('useInterval', () => {
  it('should work', async () => {

    const counter = useInterval(10)
    expect(counter.value).toBe(0)
    await promiseTimeout(10)
    expect(counter.value).toBe(1)

    const counter1 = useInterval(10, { controls: true })

    expect(counter1.isActive.value).toBe(true)

    expect(counter1.counter.value).toBe(0)
  })

  it('should work with callback', async () =>{
    const cb = vi.fn()

    useInterval(10, { callback: cb })
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()
    expect(cb).toHaveBeenCalledWith(1)
  })
})