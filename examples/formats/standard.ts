import { FormatRegistry } from '@sinclair/typebox'

// -------------------------------------------------------------------------------------------
// Format Registration
// -------------------------------------------------------------------------------------------
FormatRegistry.Set('date-time', (value) => IsDateTime(value, true))
FormatRegistry.Set('date', (value) => IsDate(value))
FormatRegistry.Set('time', (value) => IsTime(value))
FormatRegistry.Set('email', (value) => IsEmail(value))
FormatRegistry.Set('uuid', (value) => IsUuid(value))
FormatRegistry.Set('url', (value) => IsUrl(value))
FormatRegistry.Set('ipv6', (value) => IsIPv6(value))
FormatRegistry.Set('ipv4', (value) => IsIPv4(value))

// -------------------------------------------------------------------------------------------
// https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts
// -------------------------------------------------------------------------------------------

const UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const DATE_TIME_SEPARATOR = /t|\s/i
const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/
const IPV6 = /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i
const URL = /^(?:https?|wss?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu
const EMAIL = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
function IsLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}
function IsDate(str: string): boolean {
  const matches: string[] | null = DATE.exec(str)
  if (!matches) return false
  const year: number = +matches[1]
  const month: number = +matches[2]
  const day: number = +matches[3]
  return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && IsLeapYear(year) ? 29 : DAYS[month])
}
function IsTime(str: string, strictTimeZone?: boolean): boolean {
  const matches: string[] | null = TIME.exec(str)
  if (!matches) return false
  const hr: number = +matches[1]
  const min: number = +matches[2]
  const sec: number = +matches[3]
  const tz: string | undefined = matches[4]
  const tzSign: number = matches[5] === '-' ? -1 : 1
  const tzH: number = +(matches[6] || 0)
  const tzM: number = +(matches[7] || 0)
  if (tzH > 23 || tzM > 59 || (strictTimeZone && !tz)) return false
  if (hr <= 23 && min <= 59 && sec < 60) return true
  const utcMin = min - tzM * tzSign
  const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0)
  return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61
}
function IsDateTime(value: string, strictTimeZone?: boolean): boolean {
  const dateTime: string[] = value.split(DATE_TIME_SEPARATOR)
  return dateTime.length === 2 && IsDate(dateTime[0]) && IsTime(dateTime[1], strictTimeZone)
}
function IsEmail(value: string) {
  return EMAIL.test(value)
}
function IsUuid(value: string) {
  return UUID.test(value)
}
function IsUrl(value: string) {
  return URL.test(value)
}
function IsIPv6(value: string) {
  return IPV6.test(value)
}
function IsIPv4(value: string) {
  return IPV4.test(value)
}

