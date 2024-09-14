import { MaybeRefOrGetter, toValue } from "@mini-vueuse/shared";
import { computed, ComputedRef } from "vue";


export interface UsePrecisionOptions {
  math?: 'ceil' | 'floor' | 'round'
}

function accurateMultiply(value: number, power: number) {
  const valueStr = value.toString()
  if ( value > 0 && valueStr.indexOf('.') > -1 ) {
    const decimalPlaces = valueStr.split('.')[1].length

    const multiplier = 10 ** decimalPlaces

    // console.log('value * power * multiplier', value * multiplier *  power );
    
    // 这里要注意一定要先乘以 multiplier, 将value转化成整数，如果先乘power, 会导致小数点后丢失(这也是需要乘multiplier的原因)
    return (value * multiplier * power) / multiplier
    
  } else {
    return value * power
  }
}

// 与toFixed不同, toFixed保留指定size的精度, 当前计算方法为丢掉末位的0
export function usePrecision(
  value: MaybeRefOrGetter<number>, 
  digits: MaybeRefOrGetter<number>,
  options: UsePrecisionOptions = {}): ComputedRef<number> {

  return computed<number>(() => {
    const _value = toValue(value)
    const _digits = toValue(digits)
    const power = Math.pow(10, _digits)
    // 当前算法 不可行 比如usePrecision(2.3, 2)
    // return Math[options.math || 'round'](_value * Math.pow(10, _digits)) / Math.pow(10, _digits)
    return Math[options.math || 'round'](accurateMultiply(_value, power)) / power
  })
}
