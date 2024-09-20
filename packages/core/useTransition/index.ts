import { MaybeRef, MaybeRefOrGetter, toValue } from '@mini-vueuse/shared'
import { Ref } from 'vue'
import { identity as linear } from '@mini-vueuse/shared'

export type EasingFunction = (t: number) => number
export type CubicBezierPoints = [number, number, number, number]

// 线性插值函数 可以用于平滑地过渡两个值之间的变化
function lerp(a: number, b: number, alpha: number) {
  return a + (b - a) * alpha
}

function toVec(t: number | number[] | undefined) {
  return (typeof t === 'number' ? [t] : t) || []
}

export interface TransitionOptions {
  duration?: MaybeRef<number>

  transition?: MaybeRef<EasingFunction | CubicBezierPoints>
}

export interface UseTransitionOptions {}

export function executeTransition<T extends number>(
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

  return new Promise<void>((resolve) => {
    const tick = () => {}

    tick()
  })
}

export function useTransition(
  source: MaybeRefOrGetter<number | number[]> | MaybeRefOrGetter<number>[],
  options: UseTransitionOptions = {}
) {}
