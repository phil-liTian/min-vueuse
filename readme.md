### 目的: 理解vueuse/core的源码思路。整个系统基于vitest实现测试流程, 采用ts实现, 是对vueuse/core、vueuse/shared和vueuse/components核心api的具体实现。

#### 已实现的hooks有:

```js 
1. useEventListener // 实现事件监听
2. useMounted // 相当于创建一个isMounted 在onMounted的时候将isMounted设置为true
3. useMemory // Performance中的的memory对象, 获取当前性能相关数据
4. useIntervalFn // 实现setInterval, 返回一个pausable对象, 可暂停、可恢复、可立即执行
6. useMouse // 获取当前坐标位置（兼容移动端场景）; 可用组件形式使用
7. useTitle // 动态更新document.title
8. useBattery // 获取当前电池状态
9. onClickOutside // 点击当前el之外的区域（hooks、component、directive）
10. onKeyStroke // 监听键盘事件, 只有触发特定的key才触发回调函数(hook、directive)
11. onStartTyping // 监听键盘事件, 处理可编辑html标签, 只有元素可编辑且键盘点击1-9、a-z、A-Z才可触发回调
12. useNetwork // 用于获取当前网络状态
13. useRafFn // 使用requestAnimationFrame优化setInterval性能, 返回Pausable对象 可中断、可恢复
14. useNow // 轮询获取当前时间
15. useTimeAgo // 获取某个时间距另一时间的间隔 返回Pausable对象 可中断、可恢复
16. watchArray // 监听数组, 与原始watch不同的是 监听数组返回新增和删除的元素
17. createGlobalState // 创建一个全局可监听的状态, 可以有事件、状态；可以跨vue组件使用
18. useToggle // 实现状态切换, 支持自定义truthyValue/falsyValue
19. useCloned // 实现克隆 可自定义dump 和 parse, clone为false则为浅层次的克隆
20. useManualRefHistory // 手动记录ref的更新状态(commit) redo撤销 redo撤销上一次撤销(回退) 使用redoStack、undoStack分别的记录撤销和回退的数组 可使用clear清空 last为当前ref, reset可回退到上一个commit的ref状态
21. watchIgnorable // 监听属性变化, 可忽视部分ref更新, ignoreUpdates回调函数中的trigger会被忽略 分sync和非sync两种情况处理
22. useRefHistory // watchIgnorable和useManualRefHistory 的综合体，可中断、可恢复. batch处理很妙！结合ignoreUpdates和canceled变量实现 只更新一次。使用函数穿参, 实现可0次update。
23. useFps // 计算当前页面渲染的帧率
24. useDebounceFn // 返回一个防抖函数, 支持配置maxWait和rejectOnCancel
25. watchWithFilter // 利用createFilterWrapper中eventFilter函数, 处理一个按条件执行的cb, eventFilter函数，可动态控制invoke是否执行
26. watchDebounced // 将debounceFilter作为watchWithFilter中的eventFilter，实现防抖执行回调函数
27. refDebounced // 监听source value,使用useDebounceFn来实现防抖更新ref
28. tryOnBeforeMount // 安全onBeforeMount 安全钩子, 在非vue组件生命周期使用,直接执行cb
29. tryOnMounted
30. tryOnBeforeUnmount
31. tryOnUnmounted
32. useVModel // 实现双向绑定, 接受父级组件props, key, emit(vue组件实例上的emit), 配置项可配置事件名.对象可用passive实现
33. useVModels // 实现一次绑定多个值, 返回一个toRefs类型的值, 可直接绑定一个对象, 实现的是各个元素的双向绑定的方法udpate:xxx
34. useThrottleFn // 返回一个节流函数, 在delay时间内执行一次, 计算lastExec上一次执行时间到当前时间的时间间隔是否大于ms,大于才执行
35. watchThrottled // 监听source变化, 在throttle时间内最多执行一次, 结合createFilterWrapper实现
36. refThrottled // 返回一个节流的ref, 监听这个ref的变化, 在delay时间内最多执行一次
37. useThrottledRefHistory // 返回一个防抖的history, 记录ref变化快照，在throttle的时间内最多记录一次
38. useCounter // 返回一个counter, 可指定其最大、最小值。
39. useEventBus // 时间总线event bus, 可实现任意组件之间通讯。创建全局events map对象，on注册事件，off注销事件
40. useTimeoutFn // 延时执行的任务 返回一个 Stopable对象 可暂停、可恢复、可立即执行
41. useClipboard // 复制文本到剪切板, 使用navigator?.clipboard.writeText实现，如果不支持当前api可降级使用document.execCommand('copy')实现
42. useClipboardItems // 拷贝一个ClipboardItem实例 与useClipboard不同, 使用navigator!.clipboard.write(value!)实现
43. usePermission // 实现浏览器使用权限查询, 使用navigator!.permissions.query(desc)实现，desc是一个对象{name: string}
44. useInterval // 返回一个counter 对象, 将controls设置成ture的话可实现暂停、可恢复、可立即执行
45. useTimeStamp // 获取当前时间戳, interval: number | 'requestAnimationFrame' 两种实现方式, 返回Pausable对象 可中断、可恢复
46. useTimeout // 返回一个ready状态， 将control设置成true, 可返回一个Stopable对象
47. reactify // 工具方法, 将fn转化成参数可传递ref的函数 fn.bind(this, args.map(v => toValue(v)))
48. useGeolocation // 获取当前地理位置信息, navigator?.geolocation.watchPosition
49. useIdle  // 跟踪用户是否处于活动状态 true为非活动状态 false为活动状态， 监听mousemove、keydown等事件
50. usePageLeave // 监听页面离开 利用event.relatedTarget || event.toElement实现
51. watchPausable // 返回可中断、可恢复的watch
52. useStorage // 创建可用于访问和修改storage的引用, 默认使用localStorage, 通过自定义各种类型数据的序列化函数有效解决序列化本身存在的无法解决Map、Set等数据结构的问题。利用watchPausable实现可暂停可恢复的watch.有效避免使用read更新data触发watch的问题
53. useLocalStorage // 创建一个localStorage的ref, useStorage方法storage方式使用localStorage
53. useSessionStorage // 创建一个sessionStorage的ref, useStorage方法storage方式使用sessionStorage
54. useStorageSync // 支持异步方式的useStorage
```

#### 已实现的components有:

```js
1. UseMouse
2. OnClickOutside
3. UseBattery
4. UseTimeAgo
5. UseNetWork
6. UseClipboard
7. UseOnline // 获取在线状态
8. UseGeolocation // 获取当前地理位置
9. UseIdle // 监听用户是否处于活动状态
10. UsePageLeave
```

#### 已实现的自定义指令

```js
1. vOnClickOutside
2. vOnKeyStroke
3. vCopy
```

#### math

```js
1. useMax
2. useMin
3. useTrunc
4. useCeil
5. useFloor
6. useAbs
7. logicAnd
8. logicNot
9. logicOr
10. usePrecision // 设置数字的精度, 不能先x * 100 / 100这样计算, 如果有小数点的话, 直接乘10 ** digits / 10 ** digits是不可行的, 小数点应该先处理乘整数再计算，否则可能导致未知错误
11. useRound // 四舍五入
12. useSum
13. useAverage // 平均值 元素可以ref， 普通number或者函数
14. createGenericProjection // 数字投影基础方法
15. createProjection // 从一个域到另一个域的数字投影
16. useClamp // 限制数字在min和max之间, 使用基础方法clamp实现
17. useMath // 可以使用math上的所有方法，并且元素可以是ref类型
```

#### array
```js
1. useArrayEvery // 处理响应式数组, 返回computedRef<boolean>
2. useArrayDifference // 在original中过滤掉在others中的元素, compareFn为比较函数, 可以传入函数或者字符串
3. useArrayFilter // 处理响应式数组, 返回符合filter函数的元素
4. useArrayFind // 处理响应式数组, 返回找到的数组元素
5. useArrayFindIndex // 处理响应式数组, 返回找到的数组元素的索引
6. useArrayFindLast // 处理响应式数组, 从后面开始找 返回找到的数组元素
7. useArrayIncludes // 返回computedRef<boolean> 判断数组是否包含某元素, 可以指定comparator
8. useArrayJoin // 返回Compunted<string> 使用separator拼接字符串
```

#### 工具方法总结

```js
1. tryOnScopeDispose // 清除effectScope中的副作用
2. toValue // 将ref对象或者函数转化为value
3. get // 丰富unRef的功能
4. set // set ref、reactive value
```

#### 处理时间格式

```js
1. useDateFormat // 实现dayjs中时间格式化功能
2. useTimeAgo // 获取某个时间距另一时间的间隔 返回Pausable对象 可中断、可恢复
```

#### 浏览器
```js
1. useOnline // 在线状态监听
```


#### watch 监视

```js
1. whenever // 当监听属性为true时 触发回调函数
2. watchIgnore
3. watchWithFilter
```

#### 使用vitest进行测试

```js
1. promiseTimeout // 延时执行任务
2. mount
3. useSetup
```
