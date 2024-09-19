import { MaybeRef, Mutable, objectOmit, tryOnMounted } from "@mini-vueuse/shared";
import { MaybeComputedElementRef, unRefElement } from "../unrefElement";
import { ConfigableWindow, defaultWindow } from "../_configurable";
import { computed, ComputedRef, Ref, shallowReactive, shallowRef, watch, WritableComputedRef } from "vue";
import useSupported from "../useSupported";
import { useRafFn } from "../useRafFn";

export type UseAnimateKeyframes = MaybeRef<Keyframe[]>

export interface UseAnimateOptions extends KeyframeAnimationOptions, ConfigableWindow {
  immediate?: boolean;

  onError?: (err: unknown) => void
}
type AnimationStoreKeys = Extract<keyof Animation, 'startTime' | 'currentTime' | 'timeline' | 'playbackRate' | 'playState' | 'pending' | 'replaceState'>


type AnimationStore = Mutable<Pick<Animation, AnimationStoreKeys>>


export interface UseAnimateReturn {
  isSupported: Ref<boolean>;

  play: () => void;
  pause: () => void;
  reverse: () => void;
  cancel: () => void;
  finish: () => void;

  // state
  startTime: WritableComputedRef<null | CSSNumberish>;
  timeline: WritableComputedRef<AnimationTimeline | null>;
  currentTime: WritableComputedRef<CSSNumberish | null>,
  playbackRate: WritableComputedRef<number>,
  playState: ComputedRef<AnimationPlayState>,
  pending: ComputedRef<boolean>,
  replaceState: ComputedRef<AnimationReplaceState>
}

export function useAnimate(
  target: MaybeComputedElementRef,
  keyframes: UseAnimateKeyframes,
  options: UseAnimateOptions | number // 可以是duration, 延迟属性
): UseAnimateReturn {
  let config: UseAnimateOptions
  let animateOptions: KeyframeAnimationOptions | undefined | number

  const isSupported = useSupported(() => window && HTMLElement && 'animate' in HTMLElement.prototype )
  const animate = shallowRef<Animation | null>(null)
  
  if ( typeof options === 'object' ) {
    config = options
    animateOptions = objectOmit(config, ['window', 'immediate'])
  } else {
    config = {
      delay: options
    }
    animateOptions = options
  }

  const {
    window = defaultWindow,
    immediate = true,
    onError = (err) => console.error(err)
  } = config

  const store = shallowReactive<AnimationStore>({
    startTime: null,
    timeline: null,
    currentTime: null,
    playbackRate: 1,
    playState: immediate ? 'idle' : 'paused',
    pending: false,
    replaceState: 'active'
  })

  const pending = computed(() => store.pending)
  const playState = computed(() => store.playState)
  const replaceState = computed(() => store.replaceState)

  const startTime = computed({
    get() {
      return store.startTime
    },
    set(val) {
      store.startTime = val
      if ( animate.value ) {
        animate.value.startTime = val
      }
    }
  })

  const currentTime = computed({
    get() {
      return store.currentTime
    },
    set(val) {
      store.currentTime = val
      if ( animate.value ) {
        animate.value.currentTime = val
      }
    }
  })

  const timeline = computed({
    get() {
      return store.timeline
    },
    set(val) {
      store.timeline = val
      if ( animate.value ) {
        animate.value.timeline = val
      }
    }
  })

  const playbackRate = computed({
    get() {
      return store.playbackRate
    },
    set(val) {
      store.playbackRate = val
      if ( animate.value ) {
        animate.value.playbackRate = val
      }
    }
  })

  watch(() => keyframes, (value) => {
    console.log('value---->', value);
  }, { deep: true })

  tryOnMounted(() => {
    update(true)
  })

  const { resume: resumeRef, pause: pauseRef } = useRafFn(() => {
    if ( !animate.value )
      return
    store.startTime = animate.value.startTime
    store.currentTime = animate.value.currentTime
    store.pending = animate.value.pending
    store.playbackRate = animate.value.playbackRate
    store.playState = animate.value.playState
    store.replaceState = animate.value.replaceState
    store.timeline = animate.value.timeline
  }, { immediate: false })

  function play() {
    if ( animate.value ) {
      try {
        animate.value.play()
        resumeRef()
      } catch( err ) {
        syncPause()
      }
    } else {
      update()
    }
  }

  function pause() {
    try {
      animate.value?.pause()
      pauseRef()
    } catch(err) {
      onError(err)
    }
  }

  function reverse () {
    if ( !animate.value ) {
      update()
    }
    try {
      animate.value?.reverse()
      syncResume()
    } catch (err){
      syncPause()
      onError(err)
    }
  }

  function cancel() {
    if ( !animate.value ) {
      update()
    }
    try {
      animate.value?.cancel()
      syncResume()
    } catch (err){
      syncPause()
      onError(err)
    }
  }

  function finish() {
    if ( !animate.value ) {
      update()
    }
    try {
      animate.value?.finish()
      syncResume()
    } catch (err){
      syncPause()
      onError(err)
    }
  }

  function update(init?: boolean) {
    const el = unRefElement(target)    
    if ( !isSupported.value || !el )
      return
    if ( !animate.value )
      animate.value = el.animate(keyframes, config)
    
    if ( init && !immediate )
      animate.value?.pause()
    else 
      syncResume()
  }

  function syncResume() {
    if ( isSupported.value )
      resumeRef()
  }

  function syncPause() {
    if ( isSupported.value )
      pauseRef()
  }


  return {
    isSupported,

    // actions
    play,
    pause,
    reverse,
    cancel,
    finish,

    // state
    pending,
    playState,
    replaceState,
    startTime,
    currentTime,
    timeline,
    playbackRate
  }
}