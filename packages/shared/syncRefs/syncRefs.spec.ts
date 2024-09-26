import { describe, expect, it } from 'vitest'
import { syncRefs } from './syncRefs'
import { ref } from 'vue'

describe('syncRefs', () => {
  it('should work', () => {
    const source = ref('bar')
    const target1 = ref('bar1')
    const target2 = ref('bar2')
    const stop = syncRefs(source, [target1, target2])
    source.value = 'new-bar'
    expect(target1.value).toBe('new-bar')
    expect(target2.value).toBe('new-bar')

    stop()
    source.value = 'new-bar2'
    expect(target1.value).toBe('new-bar')
    expect(target2.value).toBe('new-bar')
  })
})
