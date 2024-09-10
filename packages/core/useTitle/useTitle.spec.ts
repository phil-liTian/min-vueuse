import { describe, expect, it } from "vitest";
import { useTitle } from './index'

describe("useTitle", () => {
  it('without params', () => {
    const title = useTitle()
    expect(title.value).toBe('')
    title.value = 'new Title'
    expect(title.value).toBe('new Title')
  })

  describe('with writable params', () => {
    it('string', () => {
      const title = useTitle('old title')
      expect(title.value).toEqual('old title')
      title.value = 'new title'
      expect(title.value).toEqual('new title')
    })

    it('null', () => {
      // const title = useTitle(null)
      // expect(title.value).toBe('')
    })
  })

})