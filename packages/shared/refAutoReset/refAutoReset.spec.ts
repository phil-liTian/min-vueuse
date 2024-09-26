import { describe, expect, it } from 'vitest'
import { refAutoReset } from '.'
import { promiseTimeout } from '../utils'
import { ref } from 'vue'

describe('refAutoReset', () => {
  it('should be default', () => {
    const val = refAutoReset('default')
    expect(val.value).toBe('default')
  })

  it('should be reset', async () => {
    const val = refAutoReset('default', 100)
    val.value = 'update'

    expect(val.value).toBe('update')

    await promiseTimeout(1000)
    expect(val.value).toBe('default')

    const newVal = refAutoReset(() => [1, 2, 3], 10)
    newVal.value = [4, 5]
    expect(newVal.value).toEqual([4, 5])

    await promiseTimeout(20)
    expect(newVal.value).toEqual([1, 2, 3])
  })

  it('should change afterMs', async () => {
    const afterMs = ref(150)
    const val = refAutoReset('default', afterMs)
    val.value = 'update'
    afterMs.value = 100

    await new Promise((resolve) => setTimeout(resolve, 100 + 1))
    expect(val.value).toBe('update')

    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(val.value).toBe('default')

    val.value = 'update'

    await new Promise((resolve) => setTimeout(resolve, 100 + 1))
    expect(val.value).toBe('default')
  })
})
