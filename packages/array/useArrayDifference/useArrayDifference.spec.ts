import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useArrayDifference } from ".";


describe('useArrayDifference', () => {
  it('should return the difference between two arrays', () => {
    const list1 = ref([1, 2, 3, 4, 5])
    const list2 = ref([4, 5, 6])
    const result = useArrayDifference(list1, list2)
    expect(result.value).toEqual([1, 2, 3])

    list2.value = [1, 2, 4]
    expect(result.value).toEqual([3, 5])
  })

  it('should return the difference between two arrays with custom comparator', () => {
    const list1 = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = ref([{ id: 4 }, { id: 5 }, { id: 6 }])
    const result = useArrayDifference(list1, list2, (a, b) => a.id === b.id)

    expect(result.value).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])

    list2.value = [{ id: 1 }, { id: 2 }, { id: 4 }]
    expect(result.value).toEqual([{ id: 3 }, { id: 5 }])
    list1.value = [{ id: 4  }]
    expect(result.value).toEqual([])
  })

  it('should return the difference between two arrays with key', () => {
    const list1 = ref([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
    const list2 = ref([{ id: 4 }, { id: 5 }, { id: 6 }])

    const result = useArrayDifference(list1, list2, 'id')
    expect(result.value).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
})