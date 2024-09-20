export const noop = () => {}

export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'
export const isDef = <T = any>(val?: T) => typeof val !== 'undefined'

const toString = Object.prototype.toString

export const isObject = (val: string) => toString.call(val) === '[object Object]'

export const timestamp = () => +Date.now()

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
