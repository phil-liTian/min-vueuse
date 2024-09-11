import { beforeEach, describe, expect, it } from "vitest";
import { promiseTimeout, timestamp } from '@mini-vueuse/shared'
import { useTimeAgo, UseTimeAgoUnitNamesDefault as TimeUnit } from './index'
import { computed, ComputedRef, ref } from "vue";
const UNITS = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Number.POSITIVE_INFINITY, value: 31536000000, name: 'year' },
]

describe('useTimeAgo', () => {
  let baseTime: number
  const changeValue = ref(0)
  let changeTime: ComputedRef<number>
  function reset() {
    baseTime = timestamp()
    changeValue.value = 0
    changeTime = computed(() => baseTime + changeValue.value)
  }

  function getNeededTimeChange(type: TimeUnit, count: number, adjustSecond?: number) {
    
    const unit = UNITS.find(i => i.name === type)
    return (unit?.value || 0) * count + (adjustSecond || 0) * 1000 
  }

  function fullDateFormatter(value: any) {
    return new Date(value).toISOString().slice(0, 10)
  }

  beforeEach(() => {
    reset()
  })

  it('control now', async () => {
    const { timeAgo, pause, resume } = useTimeAgo(baseTime, { controls: true, updateInterval: 500, showSecond: true } )
    await promiseTimeout(400)
    expect(timeAgo.value).toContain('0 second')

    pause()
    await promiseTimeout(700)
    expect(timeAgo.value).toContain('0 second')

    resume()
    await promiseTimeout(1000)
    expect(timeAgo.value).toContain('2 seconds ago')
  })

  it('get undefined when time is Invalid', () => {
    expect(useTimeAgo('invalid').value).toBe('')
  })

  describe('just now', () => {
    it('just now', () => {
      expect(useTimeAgo(baseTime).value).toBe('just now')
    })

    it('just now use custom formatter', () => {
      expect(useTimeAgo(baseTime, { messages: { second: '{0}', future: '{0}' }, showSecond: true }).value).toBe('0')
    })
  })

  describe('second', () => {
    function testSecond(isFuture: boolean) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('minute', 1, -1) * (isFuture ? 1 : -1)

      it(`${text}: less than 1 minute`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime).value).toBe('just now')
      })

      it(`${text}: less than 1 second`, () => {
        changeValue.value = getNeededTimeChange('minute', 1, -59.6)
        expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe('in 0 second')
      })

      it(`${text}: less than 1 minute/showSecond`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe(isFuture ? 'in 59 seconds' : '59 seconds ago')
      })

      it(`${text}: less than 1 minute and more than 10 seconds with showSecond`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime, { showSecond: true, max: 1000 }).value).toBe(fullDateFormatter(changeTime.value))
      })

      it(`${text}: more than 1 minute`, () => {
        const nextTime = getNeededTimeChange('minute', 1, 1)
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime.value, { showSecond: true, max: 'second' }).value).toBe(fullDateFormatter(changeTime.value))
      })

    }
  
    testSecond(true)
    testSecond(false)
  })

  describe('minute', () => {
    function testMinute(isFuture) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('minute', 1) * (isFuture ? 1 : -1)
      it(`${text} 1 minute`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime, { showSecond: true }).value).toBe(isFuture ? 'in 1 minute' : '1 minute ago')
      })
    }

    testMinute(true)
    testMinute(false)
  })

  describe('hour', () => {
    function testHour(isFuture) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('hour', 1) * (isFuture ? 1 : -1)
      it(`${text} 1 hour`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime).value).toBe(isFuture ? 'in 1 hour' : '1 hour ago')
      })
    }

    testHour(true)
    testHour(false)
  })

  describe('day', () => {
    function testDay(isFuture) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('day', 1) * (isFuture ? 1 : -1)
      it(`${text} 1 day`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime).value).toBe(isFuture ? 'tomorrow' : 'yesterday')
      })
    }

    testDay(true)
    testDay(false)
  })

  describe('week', () => {
    function testWeek(isFuture) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('week', 1) * (isFuture ? 1 : -1)
      it(`${text} 1 week`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime).value).toBe(isFuture ? 'next week' : 'last week')
      })
    }

    testWeek(true)
    testWeek(false)
  })

  describe('month', () => {
    function testMonth(isFuture) {
      const text = isFuture ? 'future' : 'past'
      const nextTime = getNeededTimeChange('month', 1) * (isFuture ? 1 : -1)
      it(`${text} 1 month`, () => {
        changeValue.value = nextTime
        expect(useTimeAgo(changeTime).value).toBe(isFuture ? 'next month' : 'last month')
      })
    }

    testMonth(true)
    testMonth(false)
  })

  it('round', () => {
    changeValue.value = getNeededTimeChange('year', 5.9)
    expect(useTimeAgo(changeTime).value).toBe('in 6 years')

    expect(useTimeAgo(changeTime, { rounding: 'floor' }).value).toBe('in 5 years')
    expect(useTimeAgo(changeTime, { rounding: 1 }).value).toBe('in 5.9 years')
  })
})
