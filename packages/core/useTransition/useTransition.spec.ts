import { describe, it } from 'vitest'
import { ref } from 'vue'
import { executeTransition } from '.'

describe('executeTransition', () => {
  it('transition between numbers', () => {
    const source = ref(0)

    const trans = executeTransition(source, 0, 1, { duration: 50 })
  })
})

describe('useTransition', () => {
  it('transition between numbers', () => {})
})
