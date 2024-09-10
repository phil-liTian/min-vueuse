import { describe, expect, it } from "vitest";
import { useSetup } from '../../.test'
import { nextTick, Ref, ref, watch } from "vue";
import { toValue, whenever } from "../index";

describe('whenever', () => {

  it('ignore falsy state change', async () => {
    const vm = useSetup(() => {
      const number = ref(1)
      const changeNumber = v => number.value = v
      const watchCount = ref(0)
      const watchValue: Ref<number | undefined | null> = ref()
      whenever(number, (value) => {
        watchCount.value++
        watchValue.value = value
      })

      return {
        number,
        watchCount,
        watchValue,
        changeNumber
      }
    })

    expect(toValue(vm.watchCount)).toEqual(0)
    vm.changeNumber(2)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(1)
    expect(toValue(vm.watchValue)).toEqual(2)

    vm.changeNumber(0)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(1)
    expect(toValue(vm.watchValue)).toEqual(2)

    vm.changeNumber(3)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(2)
    expect(toValue(vm.watchValue)).toEqual(3)

    vm.unmount()
  })


  it('once', async () => {
    const vm = useSetup(() => {
      const number = ref(1)
      const changeNumber = v => number.value = v
      const watchCount = ref(0)
      const watchValue: Ref<number | undefined | null> = ref()
      whenever(number, (value) => {
        watchCount.value++
        watchValue.value = value
      }, { once: true })

      return {
        number,
        watchCount,
        watchValue,
        changeNumber
      }
    })

    vm.changeNumber(0)
    await nextTick()
    expect(toValue(vm.watchCount)).toBe(0)
    expect(toValue(vm.watchValue)).toBeUndefined()

    vm.changeNumber(1)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(1)
    expect(toValue(vm.watchValue)).toEqual(1)

    vm.changeNumber(2)
    await nextTick()
    expect(toValue(vm.watchCount)).toEqual(1)
    expect(toValue(vm.watchValue)).toEqual(1)

    vm.unmount()
  })
})
