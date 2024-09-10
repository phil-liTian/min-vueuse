import { computed, h } from "vue"
import { MaybeRefOrGetter } from "../utils/types"
import { toValue } from "../toValue"

export type DateLike = Date | undefined | null | string

export interface UseDateFormatOptions {
  locales?: MaybeRefOrGetter<string>
}

function formatOrdinal(num: number) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

function defaultMeridiem(hours: number, minutes: number, isLowercase: boolean, hasPeriod: boolean) {
  let m = hours > 12 ? 'PM' : 'AM'
  if ( hasPeriod ) {
    m = m.split('').reduce((pre, cur) => { return pre + `${cur}.` }, '')
  }

  return isLowercase ? m.toLowerCase() : m
}


const REGEX_PARSE = /* #__PURE__ */ /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i

const REGEX_FORMAT = /* #__PURE__ */ /[YMDHhms]o|\[([^\]]+)\]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a{1,2}|A{1,2}|m{1,2}|s{1,2}|Z{1,2}|SSS/g

export function formatDate(date: Date, formatStr: string, options: UseDateFormatOptions = {}) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const days = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  const day = date.getDay()

  const matched: Record<string, () => string | number> = {
    Yo: () => formatOrdinal(year), // 序数格式化年份
    Y: () => year,
    YY: () => String(year).slice(2),
    YYYY: () => year,
    Mo: () => formatOrdinal(month + 1),
    M: () => month + 1,
    MM: () => `${month + 1}`.padStart(2, '0'),
    MMM: () => date.toLocaleDateString(toValue(options.locales) as any, { month: 'short' }),
    MMMM: () => date.toLocaleDateString(toValue(options.locales) as any, { month: 'long' }),
    Do: () => formatOrdinal(days),
    D: () => days,
    DD: () => `${days}`.padStart(2, '0'),
    H: () => hours,
    HH: () => `${hours}`.padStart(2, '0'), // 24小时制
    h: () => hours % 12 || 12, // 12小时制
    hh: () => `${hours % 12 || 12}`.padStart(2, '0'),
    m: () => minutes,
    mm: () => `${minutes}`.padStart(2, '0'),
    s: () => seconds,
    ss: () => `${seconds}`.padStart(2, '0'),
    SSS: () => `${milliseconds}`.padStart(3, '0'),
    d: () => day,
    dd: () => date.toLocaleDateString(toValue(options.locales) as any, { weekday: 'narrow' }),
    ddd: () => date.toLocaleDateString(toValue(options.locales) as any, { weekday: 'short' }),
    dddd: () => date.toLocaleDateString(toValue(options.locales) as any, { weekday: 'long' }),
    A: () => defaultMeridiem(hours, minutes, false, false),
    AA: () => defaultMeridiem(hours, minutes, false, true),
    a: () => defaultMeridiem(hours, minutes, true, false),
    aa: () => defaultMeridiem(hours, minutes, true, true),
  }

  return formatStr.replace(REGEX_FORMAT, (match, $1) => {
    return $1 ?? matched[match]?.() ?? match
  })
  
}

export function normalizeDate(date: DateLike) {
  if ( date === undefined ) {
    return new Date()
  }

  if ( date === null ) {
    return new Date(Number.NaN)
  }
  
  if ( date instanceof Date ) {
    return new Date(date)
  }

  // 字符串且不以Z结尾
  if ( typeof date === 'string' && !/Z$/.test(date) ) {
    const d = date.match(REGEX_PARSE) as any
    const M = (d[2] - 1) || 0
    const ms = (d[7] || '0').substring(0, 3)
    return new Date(d[1], M, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms )
  }
  
  return new Date(date)
}

export function useDateFormat(date: MaybeRefOrGetter<DateLike>, formatStr: MaybeRefOrGetter<string> = 'HH:mm:ss', options: UseDateFormatOptions = {}) {
  return computed(() => formatDate(normalizeDate(toValue(date)), toValue(formatStr), options))
}

