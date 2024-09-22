import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { executeTransition, useTransition } from '.'
import { promiseTimeout } from '@mini-vueuse/shared'
import { a } from 'vitest/dist/chunks/suite.CcK46U-P'

function expectBetween(val: number, floor: number, ceil: number) {
  expect(val).toBeGreaterThan(floor)
  expect(val).toBeLessThan(ceil)
}

describe('executeTransition', () => {
  it('transition between numbers', async () => {
    const source = ref(0)

    const trans = executeTransition(source, 0, 1, { duration: 50 })
    await promiseTimeout(25)
    expectBetween(source.value, 0.25, 0.75)

    await trans
    expect(source.value).toBe(1)
  })

  it('transition between vectors', async () => {
    const source = ref([0, 0, 0])
    const trans = executeTransition(source, [0, 1, 2], [1, 2, 3], { duration: 50 })

    await promiseTimeout(25)
    expectBetween(source.value[0], 0, 1)
    expectBetween(source.value[1], 1, 2)
    expectBetween(source.value[2], 2, 3)

    await trans
    expect(source.value).toEqual([1, 2, 3])
  })

  it('transition can be abort', async () => {
    let abort = true
    const source = ref(0)
    const trans = executeTransition(source, 0, 1, { duration: 50, abort: () => abort })
    await promiseTimeout(25)
    expect(source.value).toBe(0)
  })
})

describe('useTransition', () => {
  it('transition between numbers', async () => {
    const source = ref(0)
    const transition = useTransition(source, { duration: 100 })
    expect(transition.value).toBe(0)

    source.value = 1
    await promiseTimeout(50)
    expectBetween(transition.value, 0, 1)
    await promiseTimeout(100)
    expect(transition.value).toBe(1)
  })

  it('transition between vectors', async () => {
    const source = ref([0, 0, 0])
    const transition = useTransition(source, { duration: 100 })
    expect(transition.value).toEqual([0, 0, 0])

    source.value = [1, 2, 3]
    await promiseTimeout(50)
    expectBetween(transition.value[0], 0, 1)
    expectBetween(transition.value[1], 0, 2)
    expectBetween(transition.value[2], 0, 3)

    await promiseTimeout(100)
    expect(transition.value[0]).toBe(1)
    expect(transition.value[1]).toBe(2)
  })

  it('transition can between refs', async () => {
    const source1 = ref(0)
    const source2 = ref(0)
    const transition = useTransition([source1, source2], { duration: 100 })
    expect(transition.value).toEqual([0, 0])
    source1.value = 1
    source2.value = 1
    await promiseTimeout(50)
    expectBetween(transition.value[0], 0, 1)
    expectBetween(transition.value[1], 0, 1)

    await promiseTimeout(100)
    expect(transition.value).toEqual([1, 1])
  })

  it('supports cubic bezier curves', async () => {
    const source = ref(0)
    const easeOutBack = useTransition(source, {
      transition: [0, 2, 0, 1],
      duration: 100
    })

    source.value = 1

    await promiseTimeout(50)
    expectBetween(easeOutBack.value, 1, 2)

    await promiseTimeout(100)
    expect(easeOutBack.value).toBe(1)
  })

  it('support custom easing functions', async () => {
    const source = ref(0)
    const linear = vi.fn((n) => n)
    const transition = useTransition(source, {
      transition: linear,
      duration: 100
    })
    expect(linear).not.toBeCalled()
    source.value = 1
    await promiseTimeout(50)
    expect(linear).toBeCalled()
    expectBetween(transition.value, 0, 1)
    await promiseTimeout(100)
    expect(transition.value).toBe(1)
  })

  it('support delayed transition', async () => {
    const source = ref(0)
    const transition = useTransition(source, {
      duration: 100,
      delay: 100
    })

    source.value = 1
    await promiseTimeout(50)
    expect(transition.value).toBe(0)
    await promiseTimeout(100)
    expectBetween(transition.value, 0, 1)
  })

  it('support onStarted and onFinished callback', async () => {
    const source = ref(0)
    const onStarted = vi.fn()
    const onFinished = vi.fn()

    useTransition(source, {
      duration: 100,
      onStarted,
      onFinished
    })

    expect(onFinished).not.toBeCalled()
    expect(onStarted).not.toBeCalled()

    source.value = 1
    await promiseTimeout(50)

    expect(onStarted).toBeCalled()
    expect(onFinished).not.toBeCalled()

    await promiseTimeout(100)
    expect(onFinished).toBeCalled()
  })

  it('clear pending transition before start a new one', async () => {
    const source = ref(0)
    const onStarted = vi.fn()
    const onFinished = vi.fn()
    useTransition(source, {
      delay: 100,
      duration: 100,
      onStarted,
      onFinished
    })

    source.value = 1
    await promiseTimeout(50)
    source.value = 2
    await promiseTimeout(150)
    expect(onStarted).toBeCalledTimes(1)
  })

  it('can be disabled for sync change', async () => {
    const source = ref(0)
    const disabled = ref(false)
    const transition = useTransition(source, {
      disabled,
      duration: 100
    })

    expect(transition.value).toBe(0)
    source.value = 1
    // await promiseTimeout(50)
    disabled.value = true
    source.value = 2
    expect(transition.value).toBe(0)
  })
})
