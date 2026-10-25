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

import * as Schema from '../../schema/index.ts'

// ------------------------------------------------------------------
// BuildInfo
// ------------------------------------------------------------------
export interface BuildInfo {
  // NameOf
  NameOfNamespace: string
  NameOfCheckContext: string
  NameOfException: string
  NameOfFormat: string
  NameOfGlobalGuard: string
  NameOfGuard: string
  NameOfHashing: string
  NameOfIdna: string
  NameOfMetadata: string
  NameOfValidator: string
  // Header
  UseException: boolean
  UseValidatorDefinition: boolean
  // Guard
  UseGuardIsArray: boolean
  UseGuardIsBigInt: boolean
  UseGuardIsBoolean: boolean
  UseGuardIsConstructor: boolean
  UseGuardIsFunction: boolean
  UseGuardIsInteger: boolean
  UseGuardIsNull: boolean
  UseGuardIsNumber: boolean
  UseGuardIsObject: boolean
  UseGuardIsString: boolean
  UseGuardIsSymbol: boolean
  UseGuardIsUndefined: boolean
  UseGuardCodePointCount: boolean
  UseGuardIsDeepEqual: boolean
  UseGuardMultipleOf: boolean
  // Formats
  UseFormatDateTime: boolean
  UseFormatDate: boolean
  UseFormatDuration: boolean
  UseFormatEmail: boolean
  UseFormatHostname: boolean
  UseFormatIdnEmail: boolean
  UseFormatIdnHostname: boolean
  UseFormatIpv4: boolean
  UseFormatIpv6: boolean
  UseFormatIriReference: boolean
  UseFormatIri: boolean
  UseFormatJsonPointerUriFragment: boolean
  UseFormatJsonPointer: boolean
  UseFormatRegEx: boolean
  UseFormatRelativeJsonPointer: boolean
  UseFormatTime: boolean
  UseFormatUriReference: boolean
  UseFormatUriTemplate: boolean
  UseFormatUri: boolean
  UseFormatUrl: boolean
  UseFormatUuid: boolean
  // Modules
  UseCheckContext: boolean
  UseHashing: boolean
  UseGuard: boolean
  UseGlobalGuard: boolean
  UseIdna: boolean
  UseFormat: boolean
}
// ------------------------------------------------------------------
// BuildInfo
// ------------------------------------------------------------------
function CreateBuildInfo(initial: boolean): BuildInfo {
  return {
    // NameOf
    NameOfNamespace: 'Namespace',
    NameOfCheckContext: 'CheckContext',
    NameOfException: 'Exception',
    NameOfFormat: 'Format',
    NameOfGlobalGuard: 'GlobalGuard',
    NameOfGuard: 'Guard',
    NameOfHashing: 'Hashing',
    NameOfIdna: 'Idna',
    NameOfMetadata: 'Metadata',
    NameOfValidator: 'Validator',
    // Header
    UseException: initial,
    UseValidatorDefinition: initial,
    // Guard
    UseGuardIsArray: initial,
    UseGuardIsBigInt: initial,
    UseGuardIsBoolean: initial,
    UseGuardIsConstructor: initial,
    UseGuardIsFunction: initial,
    UseGuardIsInteger: initial,
    UseGuardIsNull: initial,
    UseGuardIsNumber: initial,
    UseGuardIsObject: initial,
    UseGuardIsString: initial,
    UseGuardIsSymbol: initial,
    UseGuardIsUndefined: initial,
    UseGuardCodePointCount: initial,
    UseGuardIsDeepEqual: initial,
    UseGuardMultipleOf: initial,
    // Format
    UseFormatDateTime: initial,
    UseFormatDate: initial,
    UseFormatDuration: initial,
    UseFormatEmail: initial,
    UseFormatHostname: initial,
    UseFormatIdnEmail: initial,
    UseFormatIdnHostname: initial,
    UseFormatIpv4: initial,
    UseFormatIpv6: initial,
    UseFormatIriReference: initial,
    UseFormatIri: initial,
    UseFormatJsonPointerUriFragment: initial,
    UseFormatJsonPointer: initial,
    UseFormatRegEx: initial,
    UseFormatRelativeJsonPointer: initial,
    UseFormatTime: initial,
    UseFormatUriReference: initial,
    UseFormatUriTemplate: initial,
    UseFormatUri: initial,
    UseFormatUrl: initial,
    UseFormatUuid: initial,
    // Module
    UseCheckContext: initial,
    UseHashing: initial,
    UseGuard: initial,
    UseGlobalGuard: initial,
    UseIdna: initial,
    UseFormat: initial
  }
}
// ------------------------------------------------------------------
// FindCall
// ------------------------------------------------------------------
const patterns = new Map<string, RegExp>()

function Pattern(value: string): RegExp {
  let pattern = patterns.get(value)
  if (pattern === undefined) {
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    pattern = new RegExp(`(?<![\\w$.])${escaped}(?![\\w$])`)
    patterns.set(value, pattern)
  }
  return pattern
}
function FindCall(build: Schema.BuildResult, value: string): boolean {
  const pattern = Pattern(value)
  return build.Functions().some((content) => pattern.test(content))
}
/** Creates the namespace name */
function NameOf(names: string[], nameof: string): string {
  let name = nameof
  while (names.includes(name)) name += '_'
  return name
}
// ------------------------------------------------------------------
// Headers
// ------------------------------------------------------------------
function UseExceptions(_build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseException || true // use assignment pattern
}
function UseValidatorDefinition(_build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseValidatorDefinition || true // use assignment pattern
}
// ------------------------------------------------------------------
// Modules
// ------------------------------------------------------------------
function UseCheckContext(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseCheckContext || build.UseUnevaluated()
}
function UseHashing(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseHashing || FindCall(build, 'Hashing.Hash')
}
function UseGlobalGuard(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGlobalGuard ||
    UseHashing(build, info)
}
function UseIdna(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseIdna ||
    UseFormatHostname(build, info) ||
    UseFormatIdnHostname(build, info)
}
// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
function UseFormatDateTime(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatDateTime || FindCall(build, 'Format.IsDateTime')
}
function UseFormatDate(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatDate || FindCall(build, 'Format.IsDate') ||
    UseFormatDateTime(build, info)
}
function UseFormatTime(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatTime || FindCall(build, 'Format.IsTime') ||
    UseFormatDateTime(build, info)
}
function UseFormatDuration(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatDuration || FindCall(build, 'Format.IsDuration')
}
function UseFormatEmail(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatEmail || FindCall(build, 'Format.IsEmail')
}
function UseFormatHostname(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatHostname || FindCall(build, 'Format.IsHostname')
}
function UseFormatIdnEmail(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatIdnEmail || FindCall(build, 'Format.IsIdnEmail')
}
function UseFormatIdnHostname(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatIdnHostname || FindCall(build, 'Format.IsIdnHostname')
}
function UseFormatIpv4(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatIpv4 || FindCall(build, 'Format.IsIPv4')
}
function UseFormatIpv6(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatIpv6 || FindCall(build, 'Format.IsIPv6')
}
function UseFormatIriReference(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatIriReference || FindCall(build, 'Format.IsIriReference')
}
function UseFormatIri(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatIri || FindCall(build, 'Format.IsIri')
}
function UseFormatJsonPointerUriFragment(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatJsonPointerUriFragment || FindCall(build, 'Format.IsJsonPointerUriFragment')
}
function UseFormatJsonPointer(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatJsonPointer || FindCall(build, 'Format.IsJsonPointer')
}
function UseFormatRegEx(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatRegEx || FindCall(build, 'Format.IsRegex')
}
function UseFormatRelativeJsonPointer(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatRelativeJsonPointer || FindCall(build, 'Format.IsRelativeJsonPointer')
}
function UseFormatUriReference(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatUriReference || FindCall(build, 'Format.IsUriReference')
}
function UseFormatUriTemplate(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatUriTemplate || FindCall(build, 'Format.IsUriTemplate')
}
function UseFormatUri(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatUri || FindCall(build, 'Format.IsUri')
}
function UseFormatUuid(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatUuid || FindCall(build, 'Format.IsUuid')
}
function UseFormatUrl(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormatUrl || FindCall(build, 'Format.IsUrl')
}
function UseFormat(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseFormat ||
    UseFormatDateTime(build, info) ||
    UseFormatDate(build, info) ||
    UseFormatDuration(build, info) ||
    UseFormatEmail(build, info) ||
    UseFormatHostname(build, info) ||
    UseFormatIdnEmail(build, info) ||
    UseFormatIdnHostname(build, info) ||
    UseFormatIpv4(build, info) ||
    UseFormatIpv6(build, info) ||
    UseFormatIriReference(build, info) ||
    UseFormatIri(build, info) ||
    UseFormatJsonPointerUriFragment(build, info) ||
    UseFormatJsonPointer(build, info) ||
    UseFormatRegEx(build, info) ||
    UseFormatRelativeJsonPointer(build, info) ||
    UseFormatTime(build, info) ||
    UseFormatUriReference(build, info) ||
    UseFormatUriTemplate(build, info) ||
    UseFormatUri(build, info) ||
    UseFormatUuid(build, info) ||
    UseFormatUrl(build, info)
}

// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
function UseGuardCodePointCount(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardCodePointCount || FindCall(build, 'Guard.CodePointCount')
}
function UseGuardMultipleOf(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardMultipleOf || FindCall(build, 'Guard.IsMultipleOf')
}
function UseGuardDeepEqual(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsDeepEqual || FindCall(build, 'Guard.IsDeepEqual')
}
function UseGuardIsArray(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsArray ||
    UseHashing(build, info) ||
    UseGuardDeepEqual(build, info)
}
function UseGuardIsBigInt(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsBigInt ||
    UseHashing(build, info)
}
function UseGuardIsBoolean(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsBoolean ||
    UseHashing(build, info)
}
function UseGuardIsConstructor(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsConstructor || FindCall(build, 'Guard.IsConstructor') ||
    UseHashing(build, info)
}
function UseGuardIsFunction(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsFunction ||
    UseHashing(build, info) ||
    UseGuardIsConstructor(build, info)
}
function UseGuardIsInteger(_build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsInteger
}
function UseGuardIsNull(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsNull ||
    UseHashing(build, info)
}
function UseGuardIsNumber(_build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsNumber
}
function UseGuardIsObject(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsObject ||
    UseHashing(build, info) ||
    UseGuardDeepEqual(build, info)
}
function UseGuardIsString(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsString ||
    UseHashing(build, info)
}
function UseGuardIsSymbol(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsSymbol ||
    UseHashing(build, info)
}
function UseGuardIsUndefined(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuardIsUndefined ||
    UseHashing(build, info) ||
    UseGuardIsConstructor(build, info)
}
function UseGuard(build: Schema.BuildResult, info: BuildInfo): boolean {
  return info.UseGuard ||
    UseGuardCodePointCount(build, info) ||
    UseGuardMultipleOf(build, info) ||
    UseGuardDeepEqual(build, info) ||
    UseGuardIsArray(build, info) ||
    UseGuardIsBigInt(build, info) ||
    UseGuardIsBoolean(build, info) ||
    UseGuardIsConstructor(build, info) ||
    UseGuardIsFunction(build, info) ||
    UseGuardIsInteger(build, info) ||
    UseGuardIsNull(build, info) ||
    UseGuardIsNumber(build, info) ||
    UseGuardIsObject(build, info) ||
    UseGuardIsString(build, info) ||
    UseGuardIsSymbol(build, info) ||
    UseGuardIsUndefined(build, info)
}

// ------------------------------------------------------------------
// Derive
// ------------------------------------------------------------------
function DeriveBuildInfo(names: string[], build: Schema.BuildResult, info: BuildInfo): BuildInfo {
  // NameOf
  info.NameOfNamespace = NameOf(names, info.NameOfNamespace)
  info.NameOfCheckContext = NameOf(names, info.NameOfCheckContext)
  info.NameOfException = NameOf(names, info.NameOfException)
  info.NameOfFormat = NameOf(names, info.NameOfFormat)
  info.NameOfGlobalGuard = NameOf(names, info.NameOfGlobalGuard)
  info.NameOfGuard = NameOf(names, info.NameOfGuard)
  info.NameOfHashing = NameOf(names, info.NameOfHashing)
  info.NameOfIdna = NameOf(names, info.NameOfIdna)
  info.NameOfMetadata = NameOf(names, info.NameOfMetadata)
  info.NameOfValidator = NameOf(names, info.NameOfValidator)
  // Header
  info.UseException = UseExceptions(build, info)
  info.UseValidatorDefinition = UseValidatorDefinition(build, info)
  // Guard
  info.UseGuardIsArray = UseGuardIsArray(build, info)
  info.UseGuardIsBigInt = UseGuardIsBigInt(build, info)
  info.UseGuardIsBoolean = UseGuardIsBoolean(build, info)
  info.UseGuardIsConstructor = UseGuardIsConstructor(build, info)
  info.UseGuardIsFunction = UseGuardIsFunction(build, info)
  info.UseGuardIsInteger = UseGuardIsInteger(build, info)
  info.UseGuardIsNull = UseGuardIsNull(build, info)
  info.UseGuardIsNumber = UseGuardIsNumber(build, info)
  info.UseGuardIsObject = UseGuardIsObject(build, info)
  info.UseGuardIsString = UseGuardIsString(build, info)
  info.UseGuardIsSymbol = UseGuardIsSymbol(build, info)
  info.UseGuardIsUndefined = UseGuardIsUndefined(build, info)
  info.UseGuardCodePointCount = UseGuardCodePointCount(build, info)
  info.UseGuardIsDeepEqual = UseGuardDeepEqual(build, info)
  info.UseGuardMultipleOf = UseGuardMultipleOf(build, info)
  // Format
  info.UseFormatDateTime = UseFormatDateTime(build, info)
  info.UseFormatDate = UseFormatDate(build, info)
  info.UseFormatDuration = UseFormatDuration(build, info)
  info.UseFormatEmail = UseFormatEmail(build, info)
  info.UseFormatHostname = UseFormatHostname(build, info)
  info.UseFormatIdnEmail = UseFormatIdnEmail(build, info)
  info.UseFormatIdnHostname = UseFormatIdnHostname(build, info)
  info.UseFormatIpv4 = UseFormatIpv4(build, info)
  info.UseFormatIpv6 = UseFormatIpv6(build, info)
  info.UseFormatIriReference = UseFormatIriReference(build, info)
  info.UseFormatIri = UseFormatIri(build, info)
  info.UseFormatJsonPointerUriFragment = UseFormatJsonPointerUriFragment(build, info)
  info.UseFormatJsonPointer = UseFormatJsonPointer(build, info)
  info.UseFormatRegEx = UseFormatRegEx(build, info)
  info.UseFormatRelativeJsonPointer = UseFormatRelativeJsonPointer(build, info)
  info.UseFormatTime = UseFormatTime(build, info)
  info.UseFormatUriReference = UseFormatUriReference(build, info)
  info.UseFormatUriTemplate = UseFormatUriTemplate(build, info)
  info.UseFormatUri = UseFormatUri(build, info)
  info.UseFormatUrl = UseFormatUrl(build, info)
  info.UseFormatUuid = UseFormatUuid(build, info)
  // Module
  info.UseCheckContext = UseCheckContext(build, info)
  info.UseHashing = UseHashing(build, info)
  info.UseGuard = UseGuard(build, info)
  info.UseGlobalGuard = UseGlobalGuard(build, info)
  info.UseIdna = UseIdna(build, info)
  info.UseFormat = UseFormat(build, info)
  return info
}
// ------------------------------------------------------------------
// BuildInfo
// ------------------------------------------------------------------
/** Returns build information for the given Module */
export function Module(builds: Record<PropertyKey, Schema.BuildResult>, initial: boolean = false): BuildInfo {
  const names = Object.keys(builds)
  return names.reduce((info, name) => DeriveBuildInfo(names, builds[name], info), CreateBuildInfo(initial))
}
/** Returns build information for the given Type */
export function Type(build: Schema.BuildResult, initial: boolean = false): BuildInfo {
  return DeriveBuildInfo([], build, CreateBuildInfo(initial))
}
/** Returns default build information */
export function Create(initial: boolean = false): BuildInfo {
  return CreateBuildInfo(initial)
}
