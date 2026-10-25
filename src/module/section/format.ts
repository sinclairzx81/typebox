/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { Unreachable } from '../../system/unreachable/index.ts'
import { Guard } from '../../guard/index.ts'
import * as BuildInfo from '../buildinfo/index.ts'
import { Banner } from './banner.ts'

const backtick = '`'

// ------------------------------------------------------------------
// IsDateTime
// ------------------------------------------------------------------
const IsDateTime = (info: BuildInfo.BuildInfo) =>
  String.raw`  IsDateTime: (value: string): boolean => {
    const DATE_TIME_SUFFIX = /^(?:\[!?(?:(?!\.{1,2}[/\]])[A-Za-z._][A-Za-z._0-9+-]{0,13}(?:\/(?!\.{1,2}[/\]])[A-Za-z._][A-Za-z._0-9+-]{0,13})*|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])\](?:\[!?[a-z_][a-z_0-9-]*=[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\])*|(?:\[!?[a-z_][a-z_0-9-]*=[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\])*)$/
    const index = value.indexOf('[')
    const datetime = index === -1 ? value : value.slice(0, index)
    if (index !== -1 && !DATE_TIME_SUFFIX.test(value.slice(index))) return false
    const split: string[] = datetime.split(/T/i)
    return split.length === 2 && ${info.NameOfFormat}.IsDate(split[0]) && ${info.NameOfFormat}.IsTime(split[1])
  }`
// ------------------------------------------------------------------
// IsDate
// ------------------------------------------------------------------
const IsDate = () =>
  String.raw`  IsDate: (value: string): boolean => {
    const IsLeapYear = (year: number): boolean => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    const DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/
    const matches: string[] | null = DATE.exec(value)
    if (!matches) return false
    const year: number = +matches[1]
    const month: number = +matches[2]
    const day: number = +matches[3]
    return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && IsLeapYear(year) ? 29 : DAYS[month])
  }`
// ------------------------------------------------------------------
// IsDuration
// ------------------------------------------------------------------
const IsDuration = () =>
  String.raw`  IsDuration: (value: string): boolean => {
    return /^P((\d+Y(\d+M(\d+D)?)?|\d+M(\d+D)?|\d+D)(T(\d+H(\d+M(\d+S)?)?|\d+M(\d+S)?|\d+S))?|T(\d+H(\d+M(\d+S)?)?|\d+M(\d+S)?|\d+S)|\d+W)$/.test(value)
  }`
// ------------------------------------------------------------------
// IsEmail
// ------------------------------------------------------------------
const IsEmail = () =>
  String.raw`  IsEmail: (value: string): boolean => {
    return /^(?:[a-z0-9!#$%&'*+/=?^_${backtick}{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_${backtick}{|}~-]+)*|"(?:[^"\\]|\\[\x20-\x7e])*")@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*|\[(?:IPv6:[a-f0-9:]+|(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(?:\.(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})\])$/i.test(value)
  }`
// ------------------------------------------------------------------
// IsHostname
// ------------------------------------------------------------------
const IsHostname = (info: BuildInfo.BuildInfo) =>
  String.raw`  IsHostname: (value: string): boolean => {
    return ${info.NameOfIdna}.IsHostname(value)
  }`
// ------------------------------------------------------------------
// IsIdnEmail
// ------------------------------------------------------------------
const IsIdnEmail = () =>
  String.raw`  IsIdnEmail: (value: string): boolean => {
    const IdnEmail = /^(?:[A-Za-z0-9!#$%&'*+\/=?^_${backtick}{|}~\u{0080}-\u{10FFFF}-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_${backtick}{|}~\u{0080}-\u{10FFFF}-]+)*|"(?:[^"\\]|\\.)*")@[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,62})(?<!-)(?:\.[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,62})(?<!-))*$/iu
    return IdnEmail.test(value.normalize('NFC'))
  }`
// ------------------------------------------------------------------
// IsIdnHostname
// ------------------------------------------------------------------
const IsIdnHostname = (info: BuildInfo.BuildInfo) =>
  String.raw`  IsIdnHostname: (value: string): boolean => {
    return ${info.NameOfIdna}.IsIdnHostname(value)
  }`
// ------------------------------------------------------------------
// IsIPv4
// ------------------------------------------------------------------
const IsIPv4 = () =>
  String.raw`  IsIPv4: (value: string): boolean => {
    return /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/.test(value)
  }`
// ------------------------------------------------------------------
// IsIPv6
// ------------------------------------------------------------------
const IsIPv6 = () =>
  String.raw`  IsIPv6: (value: string): boolean => {
    return /^(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:)?[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)$/i.test(value)
  }`
// ------------------------------------------------------------------
// IsIriReference
// ------------------------------------------------------------------
const IsIriReference = () =>
  String.raw`  IsIriReference: (value: string): boolean => {
    const InvalidIriChars = /[\x00-\x20\x7F\\]|%(?![0-9a-fA-F]{2})/
    const MalformedScheme = /^[a-zA-Z][a-zA-Z0-9+\-.]*\/\//
    return (
      !InvalidIriChars.test(value) &&
      !MalformedScheme.test(value) &&
      URL.canParse(value, 'http://example.com')
    )
  }`
// ------------------------------------------------------------------
// IsIri
// ------------------------------------------------------------------
const IsIri = () =>
  String.raw`  IsIri: (value: string): boolean => {
    const InvalidIriChars = /[\x00-\x20<>\^${backtick}{|}\\]/
    const InvalidPercentEncoding = /%(?![0-9a-fA-F]{2})/
    if (InvalidIriChars.test(value)) return false
    if (InvalidPercentEncoding.test(value)) return false
    return URL.canParse(value)
  }`
// ------------------------------------------------------------------
// IsJsonPointerUriFragment
// ------------------------------------------------------------------
const IsJsonPointerUriFragment = () =>
  String.raw`  IsJsonPointerUriFragment: (value: string): boolean => {
    return /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i.test(value)
  }`
// ------------------------------------------------------------------
// IsJsonPointer
// ------------------------------------------------------------------
const IsJsonPointer = () =>
  String.raw`  IsJsonPointer: (value: string): boolean => {
    return /^(?:\/(?:[^~/]|~0|~1)*)*$/.test(value)
  }`
// ------------------------------------------------------------------
// IsRegex
// ------------------------------------------------------------------
const IsRegex = () =>
  String.raw`  IsRegex: (value: string): boolean => {
    try {
      new RegExp(value, 'u')
      return true
    } catch {
      return false
    }
  }`
// ------------------------------------------------------------------
// IsRelativeJsonPointer
// ------------------------------------------------------------------
const IsRelativeJsonPointer = () =>
  String.raw`  IsRelativeJsonPointer: (value: string): boolean => {
    return /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/.test(value)
  }`
// ------------------------------------------------------------------
// IsTime
// ------------------------------------------------------------------
const IsTime = () =>
  String.raw`  IsTime: (value: string, strictTimeZone: boolean = true): boolean => {
    const matches = /^(\d\d):(\d\d):(\d\d)(?:\.\d+)?(?:([Zz])|([+-])(\d\d):(\d\d))?$/.exec(value)
    if (!matches) return false
    if (strictTimeZone && !matches[4] && !matches[5]) return false
    const hr = +matches[1]
    const min = +matches[2]
    const sec = +matches[3]
    if (hr > 23 || min > 59 || sec > 60) return false
    if (matches[5]) {
      const tzH = +matches[6]
      const tzM = +matches[7]
      if (tzH > 23 || tzM > 59) return false
    }
    if (sec < 60) return true
    const tzSign = matches[5] === '-' ? -1 : 1
    const tzH = +(matches[6] || 0)
    const tzM = +(matches[7] || 0)
    const totalUtcMin = (hr * 60 + min) - tzSign * (tzH * 60 + tzM)
    return (totalUtcMin % 1440 + 1440) % 1440 === 1439
  }`
// ------------------------------------------------------------------
// IsUriReference
// ------------------------------------------------------------------
const IsUriReference = () =>
  String.raw`  IsUriReference: (value: string): boolean => {
    return /^(?:[a-z][a-z0-9+\-.]*:(?:\/\/(?:(?:[-a-z0-9._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:[\da-f]{1,4}:){6}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|::(?:[\da-f]{1,4}:){5}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:[\da-f]{1,4})?::(?:[\da-f]{1,4}:){4}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,1}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){3}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,2}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){2}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,3}[\da-f]{1,4})?::[\da-f]{1,4}:(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,4}[\da-f]{1,4})?::(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,5}[\da-f]{1,4})?::[\da-f]{1,4}|(?:(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})?::)|v[0-9a-f]+\.[-a-z0-9._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[-a-z0-9._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:\/\/(?:(?:[-a-z0-9._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:[\da-f]{1,4}:){6}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|::(?:[\da-f]{1,4}:){5}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:[\da-f]{1,4})?::(?:[\da-f]{1,4}:){4}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,1}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){3}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,2}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){2}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,3}[\da-f]{1,4})?::[\da-f]{1,4}:(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,4}[\da-f]{1,4})?::(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,5}[\da-f]{1,4})?::[\da-f]{1,4}|(?:(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})?::)|v[0-9a-f]+\.[-a-z0-9._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[-a-z0-9._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[-a-z0-9._~!$&'()*+,;=@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?)(?:\?(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i.test(value)
  }`
// ------------------------------------------------------------------
// IsUriTemplate
// ------------------------------------------------------------------
const IsUriTemplate = () =>
  String.raw`  IsUriTemplate: (value: string): boolean => {
    return /^(?:(?:[^\x00-\x20"<>%\\^${backtick}{|}\x7f]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?:\.(?:[a-z0-9_]|%[0-9a-f]{2})+)*(?::[1-9]\d{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?:\.(?:[a-z0-9_]|%[0-9a-f]{2})+)*(?::[1-9]\d{0,3}|\*)?)*\})*$/i.test(value)
  }`
// ------------------------------------------------------------------
// IsUri
// ------------------------------------------------------------------
const IsUri = () =>
  String.raw`  IsUri: (value: string): boolean => {
    return /^[a-z][a-z0-9+\-.]*:(?:\/\/(?:(?:[-a-z0-9._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:[\da-f]{1,4}:){6}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|::(?:[\da-f]{1,4}:){5}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:[\da-f]{1,4})?::(?:[\da-f]{1,4}:){4}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,1}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){3}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,2}[\da-f]{1,4})?::(?:[\da-f]{1,4}:){2}(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,3}[\da-f]{1,4})?::[\da-f]{1,4}:(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,4}[\da-f]{1,4})?::(?:[\da-f]{1,4}:[\da-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d))|(?:(?:[\da-f]{1,4}:){0,5}[\da-f]{1,4})?::[\da-f]{1,4}|(?:(?:[\da-f]{1,4}:){0,6}[\da-f]{1,4})?::)|v[0-9a-f]+\.[-a-z0-9._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)|(?:[-a-z0-9._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[-a-z0-9._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[-a-z0-9._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i.test(value)
  }`
// ------------------------------------------------------------------
// IsUuid
// ------------------------------------------------------------------
const IsUuid = () =>
  String.raw`  IsUuid: (value: string): boolean => {
    return /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(value)
  }`
// ------------------------------------------------------------------
// IsUrl
// ------------------------------------------------------------------
const IsUrl = () =>
  String.raw`  IsUrl: (value: string): boolean => {
    return URL.canParse(value)
  }`
// ------------------------------------------------------------------
// FormatModule
// ------------------------------------------------------------------
/** Creates the Format module. This function requires BuildInfo for conditional emit. */
export const FormatModule = (info: BuildInfo.BuildInfo): string => {
  const entries: [boolean, () => string][] = [
    [info.UseFormatDateTime, () => IsDateTime(info)],
    [info.UseFormatDate, IsDate],
    [info.UseFormatDuration, IsDuration],
    [info.UseFormatEmail, IsEmail],
    [info.UseFormatHostname, () => IsHostname(info)],
    [info.UseFormatIdnEmail, IsIdnEmail],
    [info.UseFormatIdnHostname, () => IsIdnHostname(info)],
    [info.UseFormatIpv4, IsIPv4],
    [info.UseFormatIpv6, IsIPv6],
    [info.UseFormatIriReference, IsIriReference],
    [info.UseFormatIri, IsIri],
    [info.UseFormatJsonPointerUriFragment, IsJsonPointerUriFragment],
    [info.UseFormatJsonPointer, IsJsonPointer],
    [info.UseFormatRegEx, IsRegex],
    [info.UseFormatRelativeJsonPointer, IsRelativeJsonPointer],
    [info.UseFormatTime, IsTime],
    [info.UseFormatUriReference, IsUriReference],
    [info.UseFormatUriTemplate, IsUriTemplate],
    [info.UseFormatUri, IsUri],
    [info.UseFormatUuid, IsUuid],
    [info.UseFormatUrl, IsUrl]
  ]
  const enabled = entries.filter(([use]) => use).map(([, emit]) => emit())
  // deno-coverage-ignore-start - guard by info.UseFormat
  if (Guard.IsEqual(enabled.length, 0)) Unreachable()
  // deno-coverage-ignore-stop
  return `${Banner('Format')}\nconst ${info.NameOfFormat} = {\n${enabled.join(',\n')}\n}`
}
