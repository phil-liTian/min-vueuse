import { describe, expect, it } from "vitest";
import { formatDate, normalizeDate, useDateFormat } from ".";

describe('useDateFormat', () => {
  it('should Export module', () => {
    expect(useDateFormat).toBeDefined()
    expect(formatDate).toBeDefined()
    expect(normalizeDate).toBeDefined()
  })

  it('should normalize date', () => {
    const currentDate = new Date().toDateString()
    expect(normalizeDate(undefined).toDateString()).toBe(currentDate)
    expect(normalizeDate(null).toDateString()).toBe('Invalid Date')
    expect(normalizeDate(new Date()).toDateString()).toBe(currentDate)
    expect(normalizeDate(new Date().toISOString().replace('Z', '')).toDateString()).toBe(currentDate)

    const date = new Date(2024, 0, 1, 0, 0, 0)
    expect(normalizeDate('2024-01')).toEqual(date)
    expect(normalizeDate('2024-01-01')).toEqual(date)
    expect(normalizeDate('2024-01-01T00:00:00:000')).toEqual(date)
  })

  it('it should work with default', () => {
    expect(useDateFormat(new Date('2024-09-10 20:00:00')).value).toBe('20:00:00')
  })

  it('should work with time string', () => {
    expect(useDateFormat('2024-09-10 20:00:00', 'YYYY-MM-DD HH:mm:ss').value).toBe('2024-09-10 20:00:00')
  })

  it('should work with YYYY-MM-DD', () => {
    expect(useDateFormat('2024-09-10', 'YYYY-MM-DD').value).toBe('2024-09-10')
  })

  it('should work with YY-M-D', () => {
    expect(useDateFormat('2024-09-10', 'YY-M-D').value).toBe('24-9-10')
  })

  it('should work with H:m:ss', () => {
    expect(useDateFormat('2024-09-10 20:00:00', 'H:m:ss').value).toBe('20:0:00')
  })

  // 12小时制
  it('should work with h:m:s', () => {
    expect(useDateFormat(new Date('2024-09-10 00:05:00'), 'h:m:s').value).toBe('12:5:0')
    expect(useDateFormat(new Date('2024-09-10 20:00:00'), 'h:m:s').value).toBe('8:0:0')
  })

  it('should work with hh:m:s', () => {
    expect(useDateFormat(new Date('2024-09-10 00:05:00'), 'hh:m:s').value).toBe('12:5:0')
    expect(useDateFormat(new Date('2024-09-10 20:00:00'), 'hh:m:s').value).toBe('08:0:0')
  })

  it('should work with HH:mm:ss', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'HH:mm:ss').value).toBe('15:05:05')
  })

  it('should work with HH:mm:ss:SSS', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05:999'), 'HH:mm:ss:SSS').value).toBe('15:05:05:999')
  })

  it('should work with HH:mm:ss d', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'HH:mm:ss d').value).toBe('15:05:05 6')
  })

  it('should work with YYYY/MM/DD dd', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'YYYY/MM/DD dd', { locales: 'en-US' }).value).toBe('2022/01/01 S')
  })

  it('should work with MMM DD YYYY', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'MMM DD YYYY', { locales: 'en-US' }).value).toBe('Jan 01 2022')
  })

  it('should work with MMMM DD YYYY', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'MMMM DD YYYY', { locales: 'en-US' }).value).toBe('January 01 2022')
  })

  it('should work with Mo Do Yo', () => {
    expect(useDateFormat(new Date('2022-01-01 15:05:05'), 'MMMM Do Yo', { locales: 'en-US' }).value).toBe('January 1st 2022nd')
    expect(useDateFormat(new Date('2022-12-11 15:05:05'), 'MMMM Do Yo', { locales: 'en-US' }).value).toBe('December 11th 2022nd')
    expect(useDateFormat(new Date('2023-12-12 15:05:05'), 'MMMM Do Yo', { locales: 'en-US' }).value).toBe('December 12th 2023rd')
    expect(useDateFormat(new Date('2024-12-23 15:05:05'), 'MMMM Do Yo', { locales: 'en-US' }).value).toBe('December 23rd 2024th')
  })

  describe('meridiem', () => {
    it.each([
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss A', expected: '03:05:05 AM' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss AA', expected: '03:05:05 A.M.' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss a', expected: '03:05:05 am' },
      { dateStr: '2022-01-01 03:05:05', formatStr: 'hh:mm:ss aa', expected: '03:05:05 a.m.' }
    ])('should work with $formatStr', ({ dateStr, formatStr, expected }) => {
      expect(useDateFormat(dateStr, formatStr).value).toBe(expected)
    })
  })


})
