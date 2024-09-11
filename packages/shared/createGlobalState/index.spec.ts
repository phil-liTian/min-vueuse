import { describe, expect, it } from "vitest";
import { createGlobalState } from ".";
import { computed, ref } from "vue";
import { useSetup } from "../../.test";

describe('createGlobalState', () => {
  it('should work in different vm', () => {
    const useGlobalState = createGlobalState(() => {
      const counter = ref(1)
      const double = computed(() => counter.value * 2)

      return {
        counter,
        double
      }
    })

    const { counter, double } = useGlobalState()

    const vm = useSetup(() => {
      const { counter, double } = useGlobalState()
      
      expect(counter.value).toBe(1)

      return {
        counter,
        double
      }
    })

    counter.value = 2
    expect(counter.value).toBe(2)
    expect(double.value).toBe(4)

    vm.unmount()

  })
})