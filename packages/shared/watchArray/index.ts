import { watch, WatchOptions, WatchSource } from "vue";
import { toValue } from "../toValue";


export declare type WatchArrayCallback<V = any, OV = any> = (value: V, oldValue: OV, added: V, removed: OV, onCleanup: (cleanUpFn: () => void) => void ) => any


export function watchArray<T, Immediate extends Readonly<boolean> = false> (source: WatchSource<T[]> | T[], cb: WatchArrayCallback<T[], Immediate extends true ? T[] | undefined : T[]>, options?: WatchOptions<Immediate> ) {

  let oldList: T[] = options?.immediate ? [] : [ ...toValue(source) ]

  return watch(source as WatchSource<T[]>, (newList, _, onCleanup) => {
    let added: T[] = []
    // 记录在新数组中仍然存在的元素的位置
    const oldListRemains = new Array(oldList.length).fill(false)
    
    for (const obj of newList) {
      let found = false
      for (let i = 0; i < oldList.length; i++) {
        if ( !oldListRemains[i] && oldList[i] === obj ) {
          found = true
          // 在新数组中仍存在的位置 置为true
          oldListRemains[i] = true
          // 找到了之后, 无需再遍历oldList了
          break
        }
      }

      // 如果在oldList里面没有找到, 则是新增的数组
      if ( !found ) {
        added.push(obj)
      }
    }

    const removed = oldList.filter((_, i) => !oldListRemains[i])
    
    cb(newList, oldList, added, removed, onCleanup)
    oldList = [ ...newList ]
  }, options)
}