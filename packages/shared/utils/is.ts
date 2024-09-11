export const noop = () => {}

const toString = Object.prototype.toString

export const isObject = (val: string) => toString.call(val) === '[object Object]'

export const timestamp = () => + Date.now()
