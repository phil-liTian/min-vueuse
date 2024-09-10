import { an } from "vitest/dist/chunks/reporters.C_zwCd4j";
import { createApp, defineComponent, h } from "vue";

export function mount<V>(Comp: V) {
  const el = document.createElement('div')
  const app = createApp(Comp as any)

  const comp = app.mount(el) as any
  const unmount = () => app.unmount()
  comp.unmount = unmount

  return comp
}

export function useSetup<T>(setup: () => T) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    }
  })

  return mount(Comp)
}