export const noop = () => {}

export const isDef = <T = any> (val?: T) => typeof val !== 'undefined'

const toString = Object.prototype.toString

export const isObject = (val: string) => toString.call(val) === '[object Object]'

export const timestamp = () => + Date.now()
