import { describe, it, expect, vi } from "vitest";
import { useTimeStamp } from ".";
import { promiseTimeout } from "@mini-vueuse/shared";

describe('useTimeStamp', () => {
  it('should work', async () => {
    const timeStamp = useTimeStamp()

    const initialValue = timeStamp.value
    await promiseTimeout(100)
    expect(timeStamp.value).toBeGreaterThan(initialValue)
  })

  it('allow for a delay start with requestAnimationFrame', async () => {
    let now
    const cb = vi.fn((time) => {
      now = time
    })

    const { resume, pause, timestamp } = useTimeStamp({
      controls: true,
      immediate: false,
      callback: cb
    })

    const initialValue = timestamp.value
    await promiseTimeout(50)
    
    expect(initialValue).toBe(timestamp.value)
    expect(now).toBe(undefined)

    resume()
    await promiseTimeout(50)
    expect(now).greaterThan(initialValue)
  })

  it('allow for a delay start with setInterval', async () => {
    let now
    const cb = vi.fn((time) => {
      now = time
    })

    const { resume, pause, timestamp } = useTimeStamp({
      controls: true,
      immediate: false,
      callback: cb,
      interval: 50
    })

    const initialValue = timestamp.value
    await promiseTimeout(50)
    
    expect(initialValue).toBe(timestamp.value)
    expect(now).toBe(undefined)

    resume()
    await promiseTimeout(50)
    expect(now).greaterThan(initialValue)
  })
})