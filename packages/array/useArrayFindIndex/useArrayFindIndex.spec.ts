import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useArrayFindIndex } from ".";
import { reactify } from "@mini-vueuse/core";


describe('useArrayFindIndex', () => {
  it('should be defined', () => {
    const item1 = ref(2)
    const item2 = ref(4)
    const item3 = ref(6)
    const item4 = ref(8)

    const index = useArrayFindIndex([item1, item2, item3, item4], (item) => item > 3)
    expect(index.value).toBe(1)

    item2.value = 3
    expect(index.value).toBe(2)
  })

  it('should be work with reactive', () => {
    const list = ref([1, 2, 3, 4])

    const index = useArrayFindIndex(list, (item) => item > 3)
    expect(index.value).toBe(3)
  })
})