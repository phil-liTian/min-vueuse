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
55. useAnimate // 使用el.animation实现动画, 结合useRafFn实现返回一个可Pausable的对象
56. useDraggable // 实现可拖拽的元素, handle可指定可拖拽的元素，默认是target；可实现在container内部进行拖拽;通过控制pointerEvent的buttons 0:左键 2:右键 4: 中键可激活拖拽事件
57. onLongPress // 长按激活handle事件, delay可设置延时激活的时间。通过记录鼠标点击时的位置相较move时的鼠标位置，如果偏差大于options.distanceThreshold则认为移动了，否则触发长按事件
58. useTransition // 对于数字或者数字数组的输入, 可动态输出一个数字或者数组，可由transition指定动态输出的线性关系,内置常见贝赛尔曲线(TransitionPresets)，也可自定义曲线函数, 本质上还是值的转换, 可通过abort函数实现动画中断逻辑
59. useTextSelection //返回window.getSelection()的值 通过toString可获取当前选中的值
60. useNavigatorLanguage // 返回浏览器当前使用的语言
61. useElementHover // 通过mouseenter和mouseleave动态返回元素的悬停状态, 通过参数可控制延时返回这个状态
62. useFocus // 自动聚焦某个元素, 通过监听target的focus和blur事件实现
63. useActiveElement // 获取当前激活的元素，可指定影子dom 动态监听focus/blur事件 返回document?.activeElement; 上下文中有元素focus时, 会动态返回相应的activeElement TODO: 移除dom元素后 重置activeElement
64. useMutationObserver // 通过 MutationObserver 监听DOM元素是否被修改，可一次实现对多个target元素进行监听； 监听元素属性修改，节点内容修改，节点添加和删除。非阻塞异步检测，可实现批量处理变化。
65. useFocusWithin // 配合useActiveElement的contains方法 判断focus的元素 是否在activeElement内 tabIndex
66. useKeyModifier // 通过event.getModifierState(modifier) 获取当前modifier的激活状态
67. useMagicKeys // 通过proxy反向代理refs对象, 在keydown时将refs中的prop置为true, 反之将refs中prop置为false,通过_连接的字符串均激活亦支持
68. useIntersectionObserver // 通过IntersectionObserver 监听DOM元素是否在视窗内, 与useMutationObserver类似, 可实现图像和资源的延迟加载(懒加载)、性能优化。实现无限滚动，自动加载更多内容。
69. useScroll // 监听scroll滚动事件，返回滚动方向，及滚动到达状态，是否到达最上下左右边界。通过setter可触发scrollTo事件, 设置滚动位置, 可通过behavior控制滚动方式。
70. useElementVisibility // 返回当前监听元素是否在scrollTarget内
71. useInfiniteScroll // 监听滚动到底部事件, 实现可无限滚动的列表，触底可加载更多, 结合useScroll可实现监听是否触底, useElementVisibility监听dom元素是否可见，不可见时可下拉加载更多。distance属性 由scroll的offset实现，可实现有条件的监听触底事件(距离distance可认为已触底)
72. useScrollLock // 通过控制target的style.overflow实现锁定滚动
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
11. UseDraggable
12. UseOnLongPress
13. UseActiveElement
14. UseElementVisibility
```

#### 已实现的自定义指令
```js
1. vOnClickOutside
2. vOnKeyStroke
3. vCopy
4. vOnLongPress
5. vElementHover
6. vScroll
7. vElementVisibility
8. vInfiniteScroll
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
9. useArrayMap // 处理响应式数组, 返回computedRef<U>
10. useArrayReduce // 处理响应式数组, 可自定义reducer函数
11. useArraySome // 处理响应式数组, 返回computedRef<boolean>
12. useArrayUnique // 处理响应式数组, 返回元素唯一的数组。简单数据类型使用Set数据类型，复杂数据类型使用reduce api实现自定义comparer函数
13. useSorted // 处理响应式数组, 返回排序后的数组，可自定义comparer和sort函数
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
4. retry // 错误重试
```
