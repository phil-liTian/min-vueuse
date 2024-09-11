import { useNow } from "../useNow";
import { MaybeRefOrGetter, Pausable, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";
export type UseTimeAgoUnitNamesDefault = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

interface UseTimeAgoUnit<Unit extends string = UseTimeAgoUnitNamesDefault> {
  max: number;
  value: number;
  name: Unit
}

type UseTimeAgoFormatter<T = number> = (value: T, past?: boolean) => string
export const DEFAULT_UNITS: UseTimeAgoUnit<UseTimeAgoUnitNamesDefault>[] = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Number.POSITIVE_INFINITY, value: 31536000000, name: 'year' },
]

const DEFAULT_MESSAGES: UseTimeAgoMessages = {
  justNow: 'just now',
  // 只替换数字 这里n还有可能是yesterday、tomorrow等值
  past: n => n.match(/\d/) ? `${n} ago` : n,
  future: n => n.match(/\d/) ? `in ${n}` : n,
  second: n => `${n} second${n > 1 ? 's' : ''}`,
  minute: n => `${n} minute${n > 1 ? 's' : ''}`,
  hour: n => `${n} hour${n > 1  ? 's' : ''}`,
  month: (n, past) => n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1  ? 's' : ''}`,
  week: (n, past) => n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1  ? 's' : ''}`,
  year: (n, past) => n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1  ? 's' : ''}`,
  day: (n, past) => n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1  ? 's' : ''}`,
  invalid: '',
}

const DEFAULT_FORMATTER = (value) => new Date(value).toISOString().slice(0, 10)


export interface FormatTimeAgoOptions<UnitNames extends string = UseTimeAgoUnitNamesDefault> {
  max?: number | UnitNames;

  rounding?: 'round' | 'floor' | 'ceil' | number;

  showSecond?: boolean;

  units?: UseTimeAgoUnit<UnitNames>[];

  messages?: UseTimeAgoMessages<UnitNames>;

  fullDateFormatter?: (date: Date) => string
}

export interface UseTimeAgoOptions<Controls extends boolean, UnitNames extends string = UseTimeAgoUnitNamesDefault> extends FormatTimeAgoOptions<UnitNames> {
  controls?: Controls;

  /**
   * default: 30000
   */
  updateInterval?: number
}

export interface UseTimeAgoMessageBuiltIn {
  justNow: string;

  past: string | UseTimeAgoFormatter<string>;

  future: string | UseTimeAgoFormatter<string>;

  invalid: string;
}

export type UseTimeAgoMessages<UnitNames extends string = UseTimeAgoUnitNamesDefault> = UseTimeAgoMessageBuiltIn & Record<UnitNames, string | UseTimeAgoFormatter<number>>


export type UseTimeAgoReturn<Controls extends boolean = true> = Controls extends true ? {
  timeAgo: ComputedRef<string> } & Pausable
 : ComputedRef<string>

export function useTimeAgo<UnitNames extends string = UseTimeAgoUnitNamesDefault>(time: MaybeRefOrGetter<number | string | Date>, options?: UseTimeAgoOptions<false, UnitNames>): UseTimeAgoReturn<false>

export function useTimeAgo<UnitNames extends string = UseTimeAgoUnitNamesDefault>(time: MaybeRefOrGetter<number | string | Date>, options?: UseTimeAgoOptions<true, UnitNames>): UseTimeAgoReturn<true>

export function useTimeAgo(time: MaybeRefOrGetter<number | string | Date>, options: UseTimeAgoOptions<boolean> = {}) {
  const { controls = false, updateInterval = 30_000 } = options

  const { now, ..._controls } = useNow({ controls: true, interval: updateInterval })

  const timeAgo = computed(() => formatTimeAgo(new Date(toValue(time)), options, toValue(now)))

  if ( controls ) {
    return {
      timeAgo,
      ..._controls
    }
  }

  return timeAgo
}

export function formatTimeAgo<UnitNames extends string = UseTimeAgoUnitNamesDefault>(from: Date, options: FormatTimeAgoOptions<UnitNames> = {}, now: Date | number = Date.now() ): string {
  const {
    max,
    showSecond = false,
    fullDateFormatter = DEFAULT_FORMATTER,
    messages = DEFAULT_MESSAGES as UseTimeAgoMessages<UnitNames>,
    units = DEFAULT_UNITS as UseTimeAgoUnit<UnitNames>[],
    rounding = 'round'
  } = options
  
  const roundFn = typeof rounding === 'number' ? (n: number) => +n.toFixed(rounding) : Math[rounding]
  
  const diff = +now - +from
  const absDiff = Math.abs(diff)

  function getValue(diff: number, unit: UseTimeAgoUnit<UnitNames>) {
    return roundFn(Math.abs(diff) / unit.value)
  }

  function format(diff: number, unit: UseTimeAgoUnit<UnitNames> ) {
    const value = getValue(diff, unit)
    const past = diff > 0
    
    // 给时间添加单位 second、minute
    const str = applyFormat(unit.name as UnitNames, value, past)
    
    // 添加 in / ago
    return applyFormat(past ? 'past' : 'future', str, past)
  }

  // 利用messages处理返回描述格式
  function applyFormat(name: UnitNames | keyof UseTimeAgoMessageBuiltIn, val: number | string, isPast: boolean) {
    const formatter = messages[name]
    // 默认的formatter都是函数
    if ( typeof formatter === 'function' ) {
      return formatter(val as never, isPast)
    }
    // 允许自定义message,使用{0}替换
    return formatter.replace('{0}', val.toString())
  }

  if ( absDiff < 60000 && !showSecond ) {
    return messages.justNow
  }

  if ( typeof max === 'number' && absDiff > max ) {
    return fullDateFormatter(new Date(from))
  }

  if ( typeof max === 'string' ) {
    const unitMax = units.find(v => v.name === max)?.max
    if ( unitMax && absDiff > unitMax ) {
      return fullDateFormatter(new Date(from))
    }
  }

  for (const [idx, unit] of units.entries()) {
    const val = getValue(diff, unit)
    if ( val <= 0 && units[idx - 1]) {
      return format(diff, units[idx - 1])
    } 
    if ( absDiff < unit.max ) {
      return format(diff, unit)
    }
  }

  return messages.invalid
}
