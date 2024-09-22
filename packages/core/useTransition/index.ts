import { MaybeRef, MaybeRefOrGetter, promiseTimeout, toValue, tryOnScopeDispose } from '@mini-vueuse/shared'
import { computed, ComputedRef, ref, Ref, watch } from 'vue'
import { identity as linear } from '@mini-vueuse/shared'

export type EasingFunction = (t: number) => number
export type CubicBezierPoints = [number, number, number, number]

// 线性插值函数 可以用于平滑地过渡两个值之间的变化
function lerp(a: number, b: number, alpha: number) {
  return a + (b - a) * alpha
}
// 转化成数组
function toVec(t: number | number[] | undefined) {
  return (typeof t === 'number' ? [t] : t) || []
}

// 生成一个贝塞尔曲线
function createEasingFunction([p0, p1, p2, p3]: CubicBezierPoints): EasingFunction {
  const a = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1
  const b = (a1: number, a2: number) => 3 * a2 - 6 * a1
  const c = (a1: number) => 3 * a1

  const calcBezier = (t: number, a1: number, a2: number) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t

  const getSlope = (t: number, a1: number, a2: number) => 3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1)

  const getTforX = (x: number) => {
    let aGuessT = x

    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, p0, p2)
      if (currentSlope === 0) return aGuessT
      const currentX = calcBezier(aGuessT, p0, p2) - x
      aGuessT -= currentX / currentSlope
    }

    return aGuessT
  }

  return (x: number) => (p0 === p1 && p2 === p3 ? x : calcBezier(getTforX(x), p1, p3))
}

export interface TransitionOptions {
  duration?: MaybeRef<number>

  transition?: MaybeRef<EasingFunction | CubicBezierPoints>

  // 可终止, 返回boolean类型控制
  abort?: () => any
}

export interface UseTransitionOptions extends TransitionOptions {
  delay?: MaybeRef<number>

  disabled?: MaybeRef<boolean>

  onStarted?: () => void

  onFinished?: () => void
}

const _TransitionPresets = {
  easeInSine: [0.12, 0, 0.39, 0],
  easeOutSine: [0.61, 1, 0.88, 1],
  easeInOutSine: [0.37, 0, 0.63, 1],
  easeInQuad: [0.11, 0, 0.5, 0],
  easeOutQuad: [0.5, 1, 0.89, 1],
  easeInOutQuad: [0.45, 0, 0.55, 1],
  easeInCubic: [0.32, 0, 0.67, 0],
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInQuart: [0.5, 0, 0.75, 0],
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInQuint: [0.64, 0, 0.78, 0],
  easeOutQuint: [0.22, 1, 0.36, 1],
  easeInOutQuint: [0.83, 0, 0.17, 1],
  easeInExpo: [0.7, 0, 0.84, 0],
  easeOutExpo: [0.16, 1, 0.3, 1],
  easeInOutExpo: [0.87, 0, 0.13, 1],
  easeInCirc: [0.55, 0, 1, 0.45],
  easeOutCirc: [0, 0.55, 0.45, 1],
  easeInOutCirc: [0.85, 0, 0.15, 1],
  easeInBack: [0.36, 0, 0.66, -0.56],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.6, 0.32, 1.6]
}

export const TransitionPresets = Object.assign({}, { linear }, _TransitionPresets) as Record<
  keyof typeof _TransitionPresets,
  CubicBezierPoints
> & { linear: EasingFunction }

export function executeTransition<T extends number | number[]>(
  source: Ref<T>,
  from: MaybeRefOrGetter<T>,
  to: MaybeRefOrGetter<T>,
  options: TransitionOptions = {}
) {
  const fromVal = toValue(from)
  const toVal = toValue(to)
  const v1 = toVec(fromVal)
  const v2 = toVec(toVal)
  const duration = toValue(options.duration) ?? 1000
  const startedAt = Date.now()
  const endAt = startedAt + duration

  const trans = typeof options.transition === 'function' ? options.transition : toValue(options.transition) ?? linear

  const ease = typeof trans === 'function' ? trans : createEasingFunction(trans)

  return new Promise<void>((resolve) => {
    const tick = () => {
      if (options.abort?.()) {
        resolve()
        return
      }

      const now = Date.now()
      const alpha = ease((now - startedAt) / duration)
      const arr = toVec(source.value).map((n, i) => lerp(v1[i], v2[i], alpha))

      if (Array.isArray(source.value)) {
        ;(source.value as number[]) = (arr as number[]).map((_, i) => arr[i] as number)
      } else if (typeof source.value === 'number') {
        ;(source.value as number) = arr[0]
      }

      if (now < endAt) {
        requestAnimationFrame(tick)
      } else {
        source.value = toVal
        resolve()
      }
    }

    tick()
  })
}

export function useTransition(source: MaybeRefOrGetter<number>, options: UseTransitionOptions): ComputedRef<number>

export function useTransition<T>(source: T, options?: UseTransitionOptions): ComputedRef<number[]>

export function useTransition(
  source: MaybeRefOrGetter<number | number[]> | MaybeRefOrGetter<number>[],
  options: UseTransitionOptions = {}
) {
  let currentId = 0
  const sourceVal = () => {
    const v = toValue(source)
    return typeof v === 'number' ? v : v.map(toValue<number>)
  }

  const outputVal = ref(sourceVal())

  watch(
    sourceVal,
    async (to) => {
      if (toValue(options.disabled)) return
      const toVal = Array.isArray(to) ? to.map(toValue<number>) : toValue(to)

      const id = ++currentId
      if (options.delay) await promiseTimeout(toValue(options.delay))

      if (id !== currentId) {
        return
      }
      options.onStarted?.()
      await executeTransition(outputVal, outputVal.value, toVal, {
        ...options,
        abort: () => id !== currentId
      })

      options.onFinished?.()
    },
    { deep: true }
  )

  watch(
    () => toValue(options.disabled),
    (disabled) => {
      if (disabled) {
        currentId++
        outputVal.value = sourceVal()
      }
    }
  )

  tryOnScopeDispose(() => {
    currentId++
  })

  return computed(() => toValue(outputVal))
}
