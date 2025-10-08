/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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

import { Guard } from '../guard/index.ts'

// ------------------------------------------------------------------
// ValidationError
// ------------------------------------------------------------------
export type TValidationError =
  | TAdditionalPropertiesError
  | TAnyOfError
  | TBooleanError
  | TConstError
  | TContainsError
  | TDependenciesError
  | TDependentRequiredError
  | TEnumError
  | TExclusiveMaximumError
  | TExclusiveMinimumError
  | TFormatError
  | TGuardError
  | TIfError
  | TMaximumError
  | TMaxItemsError
  | TMaxLengthError
  | TMaxPropertiesError
  | TMinimumError
  | TMinItemsError
  | TMinLengthError
  | TMinPropertiesError
  | TMultipleOfError
  | TNotError
  | TOneOfError
  | TPatternError
  | TPropertyNamesError
  | TRefineError
  | TRequiredError
  | TTypeError
  | TUnevaluatedItemsError
  | TUnevaluatedPropertiesError
  | TUniqueItemsError

export function IsValidationError(value: unknown): value is TValidationError {
  return Guard.IsObject(value) &&
    Guard.HasPropertyKey(value, 'keyword') &&
    Guard.HasPropertyKey(value, 'schemaPath') &&
    Guard.HasPropertyKey(value, 'instancePath') &&
    Guard.HasPropertyKey(value, 'params') &&
    Guard.IsString(value.keyword) &&
    Guard.IsString(value.schemaPath) &&
    Guard.IsString(value.instancePath) &&
    Guard.IsObject(value.params)
}
// ------------------------------------------------------------------
// LocalizedValidationError
// ------------------------------------------------------------------
export type TLocalizedValidationError = TValidationError & {
  message: string
}
export function IsLocalizedValidationError(value: unknown): value is TLocalizedValidationError {
  return IsValidationError(value) &&
    Guard.HasPropertyKey(value, 'message') &&
    Guard.IsString(value.message)
}
// ------------------------------------------------------------------
// LocalizedValidationMessageCallback
// ------------------------------------------------------------------
export type TLocalizedValidationMessageCallback = (error: TValidationError) => string

// ------------------------------------------------------------------
// TValidationErrorBase
// ------------------------------------------------------------------
export interface TValidationErrorBase {
  keyword: string
  schemaPath: string
  instancePath: string
  params: object
}
// ------------------------------------------------------------------
// AnyOf
// ------------------------------------------------------------------
export interface TAdditionalPropertiesError extends TValidationErrorBase {
  keyword: 'additionalProperties'
  params: { additionalProperties: string[] }
}
// ------------------------------------------------------------------
// AnyOf
// ------------------------------------------------------------------
export interface TAnyOfError extends TValidationErrorBase {
  keyword: 'anyOf'
  params: {}
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
export interface TBooleanError extends TValidationErrorBase {
  keyword: 'boolean'
  params: {}
}
// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
export interface TConstError extends TValidationErrorBase {
  keyword: 'const'
  params: { allowedValue: unknown }
}
// ------------------------------------------------------------------
// Contains
// ------------------------------------------------------------------
export interface TContainsError extends TValidationErrorBase {
  keyword: 'contains'
  params: { minContains: number; maxContains?: number }
}
// ------------------------------------------------------------------
// Dependencies
// ------------------------------------------------------------------
export interface TDependenciesError extends TValidationErrorBase {
  keyword: 'dependencies'
  params: { property: string; dependencies: string[] }
}
// ------------------------------------------------------------------
// DependentRequired
// ------------------------------------------------------------------
export interface TDependentRequiredError extends TValidationErrorBase {
  keyword: 'dependentRequired'
  params: { property: string; dependencies: string[] }
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
export interface TEnumError extends TValidationErrorBase {
  keyword: 'enum'
  params: { allowedValues: unknown[] }
}
// ------------------------------------------------------------------
// ExclusiveMaximum
// ------------------------------------------------------------------
export interface TExclusiveMaximumError extends TValidationErrorBase {
  keyword: 'exclusiveMaximum'
  params: { comparison: '<'; limit: number | bigint }
}
// ------------------------------------------------------------------
// ExclusiveMinimum
// ------------------------------------------------------------------
export interface TExclusiveMinimumError extends TValidationErrorBase {
  keyword: 'exclusiveMinimum'
  params: { comparison: '>'; limit: number | bigint }
}
// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
export interface TFormatError extends TValidationErrorBase {
  keyword: 'format'
  params: { format: string }
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
export interface TGuardError extends TValidationErrorBase {
  keyword: '~guard'
  params: { errors: object[] }
}
// ------------------------------------------------------------------
// If
// ------------------------------------------------------------------
export interface TIfError extends TValidationErrorBase {
  keyword: 'if'
  params: { failingKeyword: 'then' | 'else' }
}
// ------------------------------------------------------------------
// Maximum
// ------------------------------------------------------------------
export interface TMaximumError extends TValidationErrorBase {
  keyword: 'maximum'
  params: { comparison: '<='; limit: number | bigint }
}
// ------------------------------------------------------------------
// MaxItems
// ------------------------------------------------------------------
export interface TMaxItemsError extends TValidationErrorBase {
  keyword: 'maxItems'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MaxLength
// ------------------------------------------------------------------
export interface TMaxLengthError extends TValidationErrorBase {
  keyword: 'maxLength'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MaxProperties
// ------------------------------------------------------------------
export interface TMaxPropertiesError extends TValidationErrorBase {
  keyword: 'maxProperties'
  params: { limit: number }
}
// ------------------------------------------------------------------
// Minimum
// ------------------------------------------------------------------
export interface TMinimumError extends TValidationErrorBase {
  keyword: 'minimum'
  params: { comparison: '>='; limit: number | bigint }
}
// ------------------------------------------------------------------
// MinItems
// ------------------------------------------------------------------
export interface TMinItemsError extends TValidationErrorBase {
  keyword: 'minItems'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MinLength
// ------------------------------------------------------------------
export interface TMinLengthError extends TValidationErrorBase {
  keyword: 'minLength'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MinProperties
// ------------------------------------------------------------------
export interface TMinPropertiesError extends TValidationErrorBase {
  keyword: 'minProperties'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MultipleOf
// ------------------------------------------------------------------
export interface TMultipleOfError extends TValidationErrorBase {
  keyword: 'multipleOf'
  params: { multipleOf: number | bigint }
}
// ------------------------------------------------------------------
// Minimum
// ------------------------------------------------------------------
export interface TMinimumError extends TValidationErrorBase {
  keyword: 'minimum'
  params: { comparison: '>='; limit: number | bigint }
}
// ------------------------------------------------------------------
// Not
// ------------------------------------------------------------------
export interface TNotError extends TValidationErrorBase {
  keyword: 'not'
  params: {}
}
// ------------------------------------------------------------------
// OneOf
// ------------------------------------------------------------------
export interface TOneOfError extends TValidationErrorBase {
  keyword: 'oneOf'
  params: { passingSchemas: number[] }
}
// ------------------------------------------------------------------
// Pattern
// ------------------------------------------------------------------
export interface TPatternError extends TValidationErrorBase {
  keyword: 'pattern'
  params: { pattern: string | RegExp }
}
// ------------------------------------------------------------------
// PropertyNames
// ------------------------------------------------------------------
export interface TPropertyNamesError extends TValidationErrorBase {
  keyword: 'propertyNames'
  params: { propertyNames: string[] }
}
// ------------------------------------------------------------------
// Refine
// ------------------------------------------------------------------
export interface TRefineError extends TValidationErrorBase {
  keyword: '~refine'
  params: { index: number; message: string }
}
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
export interface TRequiredError extends TValidationErrorBase {
  keyword: 'required'
  params: { requiredProperties: string[] }
}
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
export interface TTypeError extends TValidationErrorBase {
  keyword: 'type'
  params: { type: string | string[] }
}
// ------------------------------------------------------------------
// UnevaluatedItems
// ------------------------------------------------------------------
export interface TUnevaluatedItemsError extends TValidationErrorBase {
  keyword: 'unevaluatedItems'
  params: { unevaluatedItems: number[] }
}
// ------------------------------------------------------------------
// UnevaluatedProperties
// ------------------------------------------------------------------
export interface TUnevaluatedPropertiesError extends TValidationErrorBase {
  keyword: 'unevaluatedProperties'
  params: { unevaluatedProperties: PropertyKey[] }
}
// ------------------------------------------------------------------
// UniqueItems
// ------------------------------------------------------------------
export interface TUniqueItemsError extends TValidationErrorBase {
  keyword: 'uniqueItems'
  params: { duplicateItems: number[] }
}
