## 目的: 理解vueuse/core的源码思路。整个系统基于vitest实现测试流程, 采用ts实现, 是对vueuse/core、vueuse/shared和vueuse/components核心api的具体实现。
  
### 已实现的hooks有:

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
```

### 已实现的components有:

```js
1. UseMouse
2. onClickOutside
3. useBattery
```

### 已实现的自定义指令

```js
1. vOnClickOutside
2. vOnKeyStroke
```

### math

```js
1. useMax
2. useMin
```


### 工具方法总结

```js
1. tryOnScopeDispose // 清除effectScope中的副作用
2. toValue // 将ref对象或者函数转化为value
```

### 处理时间格式

```js
1. useDateFormat // 实现dayjs中时间格式化功能
```

### watch 监视

```js
1. whenever // 当监听属性为true时 触发回调函数
```

### 使用vitest进行测试

```js
1. promiseTimeout // 延时执行任务
2. mount
3. useSetup
```
