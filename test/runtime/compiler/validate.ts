import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'
import { TSchema } from '@sinclair/typebox'
import { Format } from 'src/format'

// -------------------------------------------------------------------------
// Test Formats: https://github.com/ajv-validator/ajv-formats/blob/master/src/formats.ts
//
//   - date-time
//   - email
//   - uuid
//
// -------------------------------------------------------------------------

const EMAIL = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
const UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i
const DATE_TIME_SEPARATOR = /t|\s/i
const TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i
const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/
const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function isDate(str: string): boolean {
  const matches: string[] | null = DATE.exec(str)
  if (!matches) return false
  const year: number = +matches[1]
  const month: number = +matches[2]
  const day: number = +matches[3]
  return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month])
}

function isTime(str: string, strictTimeZone?: boolean): boolean {
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
  // leap second
  const utcMin = min - tzM * tzSign
  const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0)
  return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61
}

function isDateTime(str: string, strictTimeZone?: boolean): boolean {
  const dateTime: string[] = str.split(DATE_TIME_SEPARATOR)
  return dateTime.length === 2 && isDate(dateTime[0]) && isTime(dateTime[1], strictTimeZone)
}

// -------------------------------------------------------------------------
// Use Formats
// -------------------------------------------------------------------------

Format.Set('email', (value) => EMAIL.test(value))
Format.Set('uuid', (value) => UUID.test(value))
Format.Set('date-time', (value) => isDateTime(value, true))

export function ok<T extends TSchema>(schema: T, data: unknown, references: any[] = []) {
  const C = TypeCompiler.Compile(schema, references)
  const result = C.Check(data)
  if (result !== Value.Check(schema, references, data)) {
    throw Error('Compiler and Value Check disparity')
  }
  if (!result) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(schema, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(data, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log(result)
    throw Error('expected ok')
  }
}

export function fail<T extends TSchema>(schema: T, data: unknown, additional: any[] = []) {
  const C = TypeCompiler.Compile(schema, additional)
  const result = C.Check(data)
  if (result) {
    console.log('---------------------------')
    console.log('type')
    console.log('---------------------------')
    console.log(JSON.stringify(schema, null, 2))
    console.log('---------------------------')
    console.log('data')
    console.log('---------------------------')
    console.log(JSON.stringify(data, null, 2))
    console.log('---------------------------')
    console.log('errors')
    console.log('---------------------------')
    console.log('none')
    throw Error('expected ok')
  }
}
