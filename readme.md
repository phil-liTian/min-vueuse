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
```

#### 已实现的components有:

```js
1. UseMouse
2. OnClickOutside
3. UseBattery
4. UseTimeAgo
```

#### 已实现的自定义指令

```js
1. vOnClickOutside
2. vOnKeyStroke
```

#### math

```js
1. useMax
2. useMin
3. useTrunc
4. useCeil
5. useFloor
6. useAbs
```

#### array

```js
1. useArrayEvery // 处理响应式数组, 返回computedRef<boolean>
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
```

#### watch 监视

```js
1. whenever // 当监听属性为true时 触发回调函数
```

#### 使用vitest进行测试

```js
1. promiseTimeout // 延时执行任务
2. mount
3. useSetup
```
