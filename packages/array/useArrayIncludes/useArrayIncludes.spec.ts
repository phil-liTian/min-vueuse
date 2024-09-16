import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useArrayIncludes } from ".";

describe('useArrayIncludes', () => {
  it('should work', () => {
    const arr = ref([1, 2, 3])
    const result = useArrayIncludes(arr, 8)
    expect(result.value).toBeFalsy()
    arr.value.push(8)
    expect(result.value).toBeTruthy()
  })

  it('should work with array of refs and string comparator', () => {
    const arr = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(arr, 3, 'id')
    expect(result.value).toBeTruthy()
    arr.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should work with array of refs and comparatorFn', () => {
    const arr = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(arr, { id: 3 }, (element, value) => element.id === value.id)
    expect(result.value).toBeTruthy()
    arr.value.pop()
    expect(result.value).toBeFalsy()
  })

  it('should work with array of refs and fromIndex', () => {
    const arr = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const result = useArrayIncludes(arr, { id: 1 }, {
      fromIndex: 1,
      comparator: (element, value) => element.id === value.id
    })

    expect(result.value).toBeFalsy()
  })
})