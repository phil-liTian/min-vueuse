import { describe, vi, it, expect, beforeEach } from 'vitest'
import { promiseTimeout } from '../utils/inedx'
import { Pausable } from '../utils/types'
import { useIntervalFn } from '.'
import { effectScope, ref } from 'vue'

describe('useInterval', () => {
  let callback = vi.fn()
  beforeEach(() => {
    callback = vi.fn()
  })

  async function exec({ isActive, pause, resume }: Pausable) {
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(0)
    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(1)

    pause()
    expect(isActive.value).toBeFalsy()

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(1)

    resume()
    expect(isActive.value).toBeTruthy()

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(2)
  }

  async function execImmediateCallback({ isActive, pause, resume }: Pausable) {

    expect(callback).toHaveBeenCalledTimes(1)
    expect(isActive.value).toBeTruthy()
    await promiseTimeout(40)
    expect(callback).toHaveBeenCalledTimes(1)
    await promiseTimeout(20)
    expect(callback).toHaveBeenCalledTimes(2)

    pause()
    expect(isActive.value).toBeFalsy()
    
    await promiseTimeout(50)
    expect(callback).toHaveBeenCalledTimes(2)

    resume()
    expect(isActive.value).toBeTruthy()
    expect(callback).toHaveBeenCalledTimes(3)
  }

  it('basic pause/resume', async () => {
    await exec(useIntervalFn(callback, 50))

    callback = vi.fn()
    const interval = ref(50)
    await exec(useIntervalFn(callback, interval))
  })

  it('pause/resume with immediateCallback', async () => {

    await execImmediateCallback(useIntervalFn(callback, 50, { immediateCallback: true }))


    callback = vi.fn()
    const interval = ref(50)
    await execImmediateCallback(useIntervalFn(callback, interval, { immediateCallback: true }))
  })

  it('pause/resume with scope', async () => {
    const scope = effectScope()

    await scope.run(async () => {
      await exec(useIntervalFn(callback, 50))
    })
    callback.mockClear()
    scope.stop()
    await promiseTimeout(60)
    expect(callback).toBeCalledTimes(0)
  })

  it('cant work when interval is negitive', async() => {
    const { isActive } = useIntervalFn(callback, -1)
    expect(isActive.value).toBeFalsy()

    await promiseTimeout(60)
    expect(callback).toHaveBeenCalledTimes(0)
  })

})
