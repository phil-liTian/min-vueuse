import { MaybeRefOrGetter, timestamp } from "@mini-vueuse/shared";
import { computed, ComputedRef, ref, Ref } from "vue";
import { CloneFn, cloneFnJson } from "../useCloned";

export interface UseRefHistoryRecord<T> {
  snapshot: T,
  timestamp: number
}

export interface UseMannualRefHistoryOptions<Raw, Serialized = Raw> {
  clone?: boolean | CloneFn<Raw>;

  dump?: (v: Raw) => Serialized;

  parse?: (v: Serialized) => Raw;

  setSource?: (source: Ref<Raw>, v: Raw) => void
}

export interface UseMannualRefHistoryReturn<Raw, Serialized> {
  source: Ref<Raw>;

  history: Ref<UseRefHistoryRecord<Serialized>[]>;

  last: Ref<UseRefHistoryRecord<Serialized>>,

  canUndo: ComputedRef<boolean>;

  canRedo: ComputedRef<boolean>;

  redoStack: Ref<UseRefHistoryRecord<Serialized>[]>;

  undoStack: Ref<UseRefHistoryRecord<Serialized>[]>;

  // 提交数据
  commit: () => void;

  // 撤销
  undo: () => void;

  // 撤销上一次撤销
  redo: () => void;

  // 清空
  clear: () => void;

  // 没有commit的ref history 可重置
  reset: () => void;
}

function fnBypass<F, T>(v: F) {
  return v
}

// 转储
function defaultDump<R, S>(clone: boolean | CloneFn<R>) {
  return (clone ? (typeof clone === 'function' ? clone : cloneFnJson ) : fnBypass) as any
}

// 解析
function defaultParse<R, S>(clone: boolean | CloneFn<R>) {
  return (clone ? (typeof clone === 'function' ? clone : cloneFnJson ) : fnBypass) as any
}

function fnSetSource<T>(source: Ref<T>, value: T) {
  source.value = value
}

export function useMannualRefHistory<Raw, Serialized = Raw>(source: Ref<Raw>, options: UseMannualRefHistoryOptions<Raw, Serialized> = {}): UseMannualRefHistoryReturn<Raw, Serialized> {
  const {
    clone = false,
    dump = defaultDump<Raw, Serialized>(clone),
    parse = defaultParse<Raw, Serialized>(clone),
    setSource = fnSetSource
  } = options

  function _createHistoryRecord(): UseRefHistoryRecord<Serialized> {
    
    return {
      snapshot: dump(source.value),
      timestamp: timestamp()
    }
  }

  function _setSource(record: UseRefHistoryRecord<Serialized>) {
    setSource(source, parse(record.snapshot))
    last.value = record
  }
  
  const last: Ref<UseRefHistoryRecord<Serialized>> = ref(_createHistoryRecord()) as Ref<UseRefHistoryRecord<Serialized>>
  // 暂存之前添加的数组
  const undoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])
  // 暂存已操作撤销的数组
  const redoStack: Ref<UseRefHistoryRecord<Serialized>[]> = ref([])
  
  // 将新增的改变的数据放到数组的第一个
  function commit() {
    // 将前一个ref放到数组的第一个(undoStack不包含当前的ref)
    undoStack.value.unshift(last.value)
    // 更新当前ref
    last.value = _createHistoryRecord()
  }

  // 清空操作记录
  function clear() {
    undoStack.value.length = 0
    redoStack.value.length = 0
  }

  // 撤销上一步操作
  function undo() {
    // 弹出第一个元素
    const state = undoStack.value.shift()
    if( state ) {
      // 将当前ref放到redoStack中, 下一步如果执行redo
      redoStack.value.unshift(last.value)
      _setSource(state)
    }
  }

  // 回退
  function redo() {
    const state = redoStack.value.shift()
    if ( state ) {
      undoStack.value.unshift(last.value)
      _setSource(state)
    }
  }

  function reset() {
    _setSource(last.value)
  }

  const history = computed(() => [last.value, ...undoStack.value])
  const canRedo = computed(() => !!redoStack.value.length)
  const canUndo = computed(() => !!undoStack.value.length)

  return {
    source,
    history,
    canRedo,
    canUndo,
    last,
    redoStack,
    undoStack,

    commit,
    undo,
    redo,
    clear,
    reset
  }
}
