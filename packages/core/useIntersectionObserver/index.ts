import { noop, notNullish, Pausable, toValue } from '@mini-vueuse/shared'
import { computed, Ref, ref, watch } from 'vue'
import useSupported from '../useSupported'
import { ConfigableWindow, defaultWindow } from '../_configurable'
import { MaybeComputedElementRef, unRefElement } from '../unrefElement'

export interface UseIntersectionObserverOptions extends ConfigableWindow, Omit<IntersectionObserverInit, 'root'> {
  immediate?: boolean

  root?: MaybeComputedElementRef
}

export interface UseIntersectionObserverReturn extends Pausable {
  isSupported: Ref<boolean>

  stop?: () => void
}

export function useIntersectionObserver(
  target,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    window = defaultWindow,
    immediate = true,
    // 设置根元素的外边距。这个值是一个 CSS 样式的字符串，类似于 margin 属性的值。它用于扩大或缩小根元素的边界，从而影响交叉检测的结果。
    // "0px 0px -100px 0px" 表示在顶部减少 100 像素的交叉检测区域。这可以在目标元素接近但尚未完全进入视口时提前触发交叉检测。
    rootMargin = '0px',
    // 当目标元素的交叉比例达到或超过这个阈值时，回调函数会被触发。
    // 如果是一个数组，可以设置多个阈值，回调函数会在目标元素的交叉比例依次达到每个阈值时被多次调用。
    threshold = 0
  } = options

  const isSupported = useSupported(() => window && 'IntersectionObserver' in window)
  let cleanup = noop
  const isActive = ref(immediate)

  const targets = computed(() => {
    const _target = toValue(target)
    return (Array.isArray(_target) ? _target : [_target]).map(unRefElement).filter(notNullish)
  })

  const stopWatch = isSupported.value
    ? watch(
        () => [targets.value],
        ([targets]) => {
          if (!targets.length) return
          const observer = new IntersectionObserver(callback, {
            rootMargin,
            threshold,
            root: unRefElement(options.root)
          })

          targets.forEach((el) => el && observer.observe(el))

          cleanup = () => {
            observer.disconnect()
            cleanup = noop
          }
        },
        {
          immediate,
          flush: 'post'
        }
      )
    : noop

  function stop() {
    cleanup()
    stopWatch()
    isActive.value = false
  }

  function resume() {
    isActive.value = true
  }

  function pause() {
    cleanup()
    isActive.value = false
  }

  return {
    isSupported,
    isActive,
    pause,
    resume,
    stop
  }
}
