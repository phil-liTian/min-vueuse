import { describe, expect, it } from 'vitest'
import { useArraySorted } from '.'
import { toValue } from '@mini-vueuse/shared'

interface User {
  name: string
  age: number
}

const arr = [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]
const arrSorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const objArr: User[] = [
  {
    name: 'John',
    age: 40
  },
  {
    name: 'Jane',
    age: 20
  },
  {
    name: 'Joe',
    age: 30
  },
  {
    name: 'Jenny',
    age: 22
  }
]
const objectSorted: User[] = [
  {
    name: 'Jane',
    age: 20
  },
  {
    name: 'Jenny',
    age: 22
  },
  {
    name: 'Joe',
    age: 30
  },
  {
    name: 'John',
    age: 40
  }
]

describe('useSorted', () => {
  it('should pure sort function', () => {
    const sorted = useArraySorted(arr)
    expect(toValue(sorted)).toEqual(arrSorted)
  })

  it('should work with dirty', () => {
    const dirtyArr = [...arr]
    const sorted = useArraySorted(dirtyArr, (a, b) => a - b, { dirty: true })

    expect(toValue(sorted)).toMatchObject(arrSorted)
    expect(toValue(dirtyArr)).toMatchObject(toValue(sorted))
  })

  it('should sort object', () => {
    const sorted = useArraySorted(objArr, (a, b) => a.age - b.age)
    expect(toValue(sorted)).toEqual(objectSorted)

    const sorted1 = useArraySorted(objArr, {
      compareFn: (a, b) => a.age - b.age
    })

    expect(toValue(sorted1)).toMatchObject(objectSorted)
  })
})
