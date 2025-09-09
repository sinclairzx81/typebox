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
  | TStandardV1Error
  | TRequiredError
  | TTypeError
  | TUnevaluatedItemsError
  | TUnevaluatedPropertiesError
  | TUniqueItemsError

// ------------------------------------------------------------------
// LocalizedValidationError
// ------------------------------------------------------------------
export type TLocalizedValidationError = TValidationError & { message: string }

// ------------------------------------------------------------------
// LocalizedValidationMessageCallback
// ------------------------------------------------------------------
export type TLocalizedValidationMessageCallback = (error: TValidationError) => string

// ------------------------------------------------------------------
// BaseError
// ------------------------------------------------------------------
export interface TBaseError {
  keyword: string
  schemaPath: string
  instancePath: string
  params: object
}
// ------------------------------------------------------------------
// AnyOf
// ------------------------------------------------------------------
export interface TAdditionalPropertiesError extends TBaseError {
  keyword: 'additionalProperties'
  params: { additionalProperties: string[] }
}
// ------------------------------------------------------------------
// AnyOf
// ------------------------------------------------------------------
export interface TAnyOfError extends TBaseError {
  keyword: 'anyOf'
  params: {}
}
// ------------------------------------------------------------------
// Boolean
// ------------------------------------------------------------------
export interface TBooleanError extends TBaseError {
  keyword: 'boolean'
  params: {}
}
// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
export interface TConstError extends TBaseError {
  keyword: 'const'
  params: { allowedValue: unknown }
}
// ------------------------------------------------------------------
// Contains
// ------------------------------------------------------------------
export interface TContainsError extends TBaseError {
  keyword: 'contains'
  params: { minContains: number; maxContains?: number }
}
// ------------------------------------------------------------------
// Dependencies
// ------------------------------------------------------------------
export interface TDependenciesError extends TBaseError {
  keyword: 'dependencies'
  params: { property: string; dependencies: string[] }
}
// ------------------------------------------------------------------
// DependentRequired
// ------------------------------------------------------------------
export interface TDependentRequiredError extends TBaseError {
  keyword: 'dependentRequired'
  params: { property: string; dependencies: string[] }
}
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
export interface TEnumError extends TBaseError {
  keyword: 'enum'
  params: { allowedValues: unknown[] }
}
// ------------------------------------------------------------------
// ExclusiveMaximum
// ------------------------------------------------------------------
export interface TExclusiveMaximumError extends TBaseError {
  keyword: 'exclusiveMaximum'
  params: { comparison: '<'; limit: number | bigint }
}
// ------------------------------------------------------------------
// ExclusiveMinimum
// ------------------------------------------------------------------
export interface TExclusiveMinimumError extends TBaseError {
  keyword: 'exclusiveMinimum'
  params: { comparison: '>'; limit: number | bigint }
}
// ------------------------------------------------------------------
// Format
// ------------------------------------------------------------------
export interface TFormatError extends TBaseError {
  keyword: 'format'
  params: { format: string }
}
// ------------------------------------------------------------------
// If
// ------------------------------------------------------------------
export interface TIfError extends TBaseError {
  keyword: 'if'
  params: { failingKeyword: 'then' | 'else' }
}
// ------------------------------------------------------------------
// Maximum
// ------------------------------------------------------------------
export interface TMaximumError extends TBaseError {
  keyword: 'maximum'
  params: { comparison: '<='; limit: number | bigint }
}
// ------------------------------------------------------------------
// MaxItems
// ------------------------------------------------------------------
export interface TMaxItemsError extends TBaseError {
  keyword: 'maxItems'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MaxLength
// ------------------------------------------------------------------
export interface TMaxLengthError extends TBaseError {
  keyword: 'maxLength'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MaxProperties
// ------------------------------------------------------------------
export interface TMaxPropertiesError extends TBaseError {
  keyword: 'maxProperties'
  params: { limit: number }
}
// ------------------------------------------------------------------
// Minimum
// ------------------------------------------------------------------
export interface TMinimumError extends TBaseError {
  keyword: 'minimum'
  params: { comparison: '>='; limit: number | bigint }
}
// ------------------------------------------------------------------
// MinItems
// ------------------------------------------------------------------
export interface TMinItemsError extends TBaseError {
  keyword: 'minItems'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MinLength
// ------------------------------------------------------------------
export interface TMinLengthError extends TBaseError {
  keyword: 'minLength'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MinProperties
// ------------------------------------------------------------------
export interface TMinPropertiesError extends TBaseError {
  keyword: 'minProperties'
  params: { limit: number }
}
// ------------------------------------------------------------------
// MultipleOf
// ------------------------------------------------------------------
export interface TMultipleOfError extends TBaseError {
  keyword: 'multipleOf'
  params: { multipleOf: number | bigint }
}
// ------------------------------------------------------------------
// Minimum
// ------------------------------------------------------------------
export interface TMinimumError extends TBaseError {
  keyword: 'minimum'
  params: { comparison: '>='; limit: number | bigint }
}
// ------------------------------------------------------------------
// Not
// ------------------------------------------------------------------
export interface TNotError extends TBaseError {
  keyword: 'not'
  params: {}
}
// ------------------------------------------------------------------
// OneOf
// ------------------------------------------------------------------
export interface TOneOfError extends TBaseError {
  keyword: 'oneOf'
  params: { passingSchemas: number[] }
}
// ------------------------------------------------------------------
// Pattern
// ------------------------------------------------------------------
export interface TPatternError extends TBaseError {
  keyword: 'pattern'
  params: { pattern: string | RegExp }
}
// ------------------------------------------------------------------
// PropertyNames
// ------------------------------------------------------------------
export interface TPropertyNamesError extends TBaseError {
  keyword: 'propertyNames'
  params: { propertyNames: string[] }
}
// ------------------------------------------------------------------
// Refine
// ------------------------------------------------------------------
export interface TRefineError extends TBaseError {
  keyword: '~refine'
  params: { index: number; message: string }
}
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
export interface TRequiredError extends TBaseError {
  keyword: 'required'
  params: { requiredProperties: string[] }
}
// ------------------------------------------------------------------
// StandardV1
// ------------------------------------------------------------------
export interface TStandardV1Error extends TBaseError {
  keyword: '~standard'
  params: { vendor: string; issues: object[] }
}
// ------------------------------------------------------------------
// Required
// ------------------------------------------------------------------
export interface TTypeError extends TBaseError {
  keyword: 'type'
  params: { type: string | string[] }
}
// ------------------------------------------------------------------
// UnevaluatedItems
// ------------------------------------------------------------------
export interface TUnevaluatedItemsError extends TBaseError {
  keyword: 'unevaluatedItems'
  params: { unevaluatedItems: number[] }
}
// ------------------------------------------------------------------
// UnevaluatedProperties
// ------------------------------------------------------------------
export interface TUnevaluatedPropertiesError extends TBaseError {
  keyword: 'unevaluatedProperties'
  params: { unevaluatedProperties: PropertyKey[] }
}
// ------------------------------------------------------------------
// UniqueItems
// ------------------------------------------------------------------
export interface TUniqueItemsError extends TBaseError {
  keyword: 'uniqueItems'
  params: { duplicateItems: number[] }
}
