import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useThrottleRefHistory } from ".";
import { promiseTimeout } from "@mini-vueuse/shared";

describe('useThrottleRefHistory', () => {
  it('should work', async () => {
    const ms = 10
    const v = ref(0)

    const { history } = useThrottleRefHistory(v, { throttle: ms })
    expect(history.value.length).toBe(1)

    expect(history.value[0].snapshot).toBe(0)

    v.value = 100
    await promiseTimeout(ms * 3)
    expect(history.value.length).toBe(2)
    expect(history.value[0].snapshot).toBe(100)

    v.value = 200
    v.value = 300
    v.value = 400
    await promiseTimeout(ms * 3)
    expect(history.value.length).toBe(3)
    expect(history.value[0].snapshot).toBe(400)
  })
})