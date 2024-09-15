import { describe, expect, it } from "vitest";
import { useTimeout } from ".";
import { promiseTimeout } from "../utils";
import { ref } from "vue";

describe('useTimeout', () => {
  it('should work', async () => {
    const ready = useTimeout(10)
    expect(ready.value).toBe(false)
    await promiseTimeout(10)
    expect(ready.value).toBe(true)
  })

  it('should work with controls', async () => {
    const num = ref(10)
    const { ready, start, stop } = useTimeout(num, { controls: true })

    expect(ready.value).toBe(false)


    // setTimeout(() => {
    //   expect(ready.value).toBe(true)
    // }, 10);
    await promiseTimeout(10)
    expect(ready.value).toBe(true)
  })
})