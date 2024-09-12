import { describe, expect, it, vi } from "vitest";
import { watchIgnorable } from ".";
import { ref, nextTick } from "vue";

describe('watchIgnorable', () => {
  it('export module', () => {
    expect(watchIgnorable).toBeDefined()
  })

  it('ignore sync update', async () => {
    const source = ref(0)
    const target = ref(0)

    const { ignoreUpdates } = watchIgnorable(source, (value) => target.value = value)

    source.value = 1
    await nextTick()
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 2
      source.value = 3
    })

    await nextTick()
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 4
    })

    source.value = 5
    await nextTick()
    expect(target.value).toBe(5)
  })

  it('ignore prev sync update',async () => {
    const target = ref(0)
    const source = ref(0)

    const { ignorePrevAsyncUpdates } = watchIgnorable(source, value => target.value = value)

    source.value = 1
    await nextTick()
    expect(target.value).toBe(1)

    source.value = 2
    source.value = 3
    ignorePrevAsyncUpdates()
    await nextTick()
    expect(target.value).toBe(1)

    source.value = 4
    await nextTick()
    expect(target.value).toBe(4)
  })

  it('stop watch', async () => {
    const callback = vi.fn()
    const source = ref(0)
    const { stop } = watchIgnorable(source, callback)

    source.value = 1
    await nextTick()
    stop()

    source.value = 2
    source.value = 3
    await nextTick()
    source.value = 4
    await nextTick()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('ignore sync updates', async () => {
    const source = ref(0)
    const target = ref(0)
    const { ignoreUpdates, ignorePrevAsyncUpdates } = watchIgnorable(source, value => target.value = value, { flush: 'sync' })

    source.value = 1
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 2
      source.value = 3
    })

    await nextTick()
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 4
    })

    source.value = 5
    await nextTick()
    expect(target.value).toBe(5)
  })
})