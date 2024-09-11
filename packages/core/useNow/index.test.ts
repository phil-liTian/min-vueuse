import { describe, it, expect } from "vitest";
import { useNow, UseNowInterval } from ".";
import { promiseTimeout } from "@mini-vueuse/shared";


describe('useNow', () => {
  it('should get now timestamp by default', () => {
    const now = useNow()
    expect(+now.value).toBeLessThanOrEqual(+new Date())
  })

  function testControl(interval: UseNowInterval) {
    it(`should control now timestamp by ${interval}`, async () => {
      let initial = +new Date()
      const { now, pause, resume } = useNow({ controls: true, interval })
      expect(initial).toBeLessThanOrEqual(+now.value)
      await promiseTimeout(50)
      expect(initial).toBeLessThan(+now.value)

      initial = +now.value
      pause()
      await promiseTimeout(50)
      expect(initial).toBeLessThanOrEqual(+now.value)

      resume()
      await promiseTimeout(50)
      expect(+now.value).toBeGreaterThanOrEqual(initial)

    }) 
  }

  testControl('requestAnimationFrame')
  testControl(50)
})
