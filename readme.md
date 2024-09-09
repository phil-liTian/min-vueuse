## 目的: 理解vueuse/core的源码思路。整个系统基于vitest实现测试流程, 采用ts实现, 是对vueuse/core、vueuse/shared和vueuse/components核心api的具体实现。
  
### 已实现的hooks有:

```js 
1. useEventListener // 实现事件监听
2. useMounted // 相当于创建一个isMounted 在onMounted的时候将isMounted设置为true
3. useMemory // Performance中的的memory对象, 获取当前性能相关数据
4. useIntervalFn // 实现setInterval, 返回一个pausable对象, 可暂停、可恢复、可立即执行
6. useMouse // 获取当前坐标位置（兼容移动端场景）; 可用组件形式使用
7. useTitle // 动态更新document.title
```

### 已实现的components有:

```js
1. UseMouse
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

### 使用vitest进行测试

```js
1. promiseTimeout // 延时执行任务
```

传感器
1. onClickOutside
2. onKeyStroke
3. onLongPress
4. onStartTyping
5. useBattery
6. useDeviceMotion
7. useDeviceOrientation
8. useDevicePixelRatio
9. useDevicesList
10. useDisplayMedia


时间
1. useDateFormat
2. useTimeAgo

数学
1. createGenericProjection
2. createProjection
3. logicAnd
4. logicNot
4. logicOr