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

// deno-fmt-ignore-file

import * as S from '../types/index.ts'
import { EmitGuard as E, Guard as G } from '../../guard/index.ts'

import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { BuildRefine, CheckRefine, ErrorRefine } from './_refine.ts'
import { BuildGuard, CheckGuard, ErrorGuard } from './_guard.ts'

import { BuildAdditionalItems, CheckAdditionalItems, ErrorAdditionalItems } from './additionalItems.ts'
import { BuildAdditionalProperties, CheckAdditionalProperties, ErrorAdditionalProperties } from './additionalProperties.ts'
import { BuildAllOf, CheckAllOf, ErrorAllOf } from './allOf.ts'
import { BuildAnyOf, CheckAnyOf, ErrorAnyOf } from './anyOf.ts'
import { BuildBooleanSchema, CheckBooleanSchema, ErrorBooleanSchema } from './boolean.ts'
import { BuildConst, CheckConst, ErrorConst } from './const.ts'
import { BuildContains, CheckContains, ErrorContains } from './contains.ts'
import { BuildDependencies, CheckDependencies, ErrorDependencies } from './dependencies.ts'
import { BuildDependentRequired, CheckDependentRequired, ErrorDependentRequired } from './dependentRequired.ts'
import { BuildDependentSchemas, CheckDependentSchemas, ErrorDependentSchemas } from './dependentSchemas.ts'
import { BuildEnum, CheckEnum, ErrorEnum } from './enum.ts'
import { BuildExclusiveMaximum, CheckExclusiveMaximum, ErrorExclusiveMaximum } from './exclusiveMaximum.ts'
import { BuildExclusiveMinimum, CheckExclusiveMinimum, ErrorExclusiveMinimum } from './exclusiveMinimum.ts'
import { BuildFormat, CheckFormat, ErrorFormat } from './format.ts'
import { BuildIf, CheckIf, ErrorIf } from './if.ts'
import { BuildItems, CheckItems, ErrorItems } from './items.ts'
import { BuildMaxContains, CheckMaxContains, ErrorMaxContains } from './maxContains.ts'
import { BuildMaximum, CheckMaximum, ErrorMaximum } from './maximum.ts'
import { BuildMaxItems, CheckMaxItems, ErrorMaxItems } from './maxItems.ts'
import { BuildMaxLength, CheckMaxLength, ErrorMaxLength } from './maxLength.ts'
import { BuildMaxProperties, CheckMaxProperties, ErrorMaxProperties } from './maxProperties.ts'
import { BuildMinContains, CheckMinContains, ErrorMinContains } from './minContains.ts'
import { BuildMinimum, CheckMinimum, ErrorMinimum } from './minimum.ts'
import { BuildMinItems, CheckMinItems, ErrorMinItems } from './minItems.ts'
import { BuildMinLength, CheckMinLength, ErrorMinLength } from './minLength.ts'
import { BuildMinProperties, CheckMinProperties, ErrorMinProperties } from './minProperties.ts'
import { BuildMultipleOf, CheckMultipleOf, ErrorMultipleOf } from './multipleOf.ts'
import { BuildNot, CheckNot, ErrorNot } from './not.ts'
import { BuildOneOf, CheckOneOf, ErrorOneOf } from './oneOf.ts'
import { BuildPattern, CheckPattern, ErrorPattern } from './pattern.ts'
import { BuildPatternProperties, CheckPatternProperties, ErrorPatternProperties } from './patternProperties.ts'
import { BuildPrefixItems, CheckPrefixItems, ErrorPrefixItems } from './prefixItems.ts'
import { BuildProperties, CheckProperties, ErrorProperties } from './properties.ts'
import { BuildPropertyNames, CheckPropertyNames, ErrorPropertyNames } from './propertyNames.ts'
import { BuildRef, CheckRef, ErrorRef } from './ref.ts'
import { BuildRequired, CheckRequired, ErrorRequired } from './required.ts'
import { BuildType, CheckType, ErrorType } from './type.ts'
import { BuildUnevaluatedItems, CheckUnevaluatedItems, ErrorUnevaluatedItems } from './unevaluatedItems.ts'
import { BuildUnevaluatedProperties, CheckUnevaluatedProperties, ErrorUnevaluatedProperties } from './unevaluatedProperties.ts'
import { BuildUniqueItems, CheckUniqueItems, ErrorUniqueItems } from './uniqueItems.ts'

// ----------------------------------------------------------------
// HasTypeName
// ----------------------------------------------------------------
function HasTypeName(schema: S.XSchema, typename: string): boolean {
  return S.IsType(schema) &&
    (G.IsArray(schema.type) && schema.type.includes(typename) ||
      G.IsEqual(schema.type, typename))
}
// ----------------------------------------------------------------
// HasObject
// ----------------------------------------------------------------
function HasObjectType(schema: S.XSchema): boolean {
  return HasTypeName(schema, 'object')
}
function HasObjectKeywords(schema: S.XSchema): boolean {
  return S.IsSchema(schema) && (
    S.IsAdditionalProperties(schema) ||
    S.IsDependencies(schema) ||
    S.IsDependentRequired(schema) ||
    S.IsDependentSchemas(schema) ||
    S.IsProperties(schema) ||
    S.IsPatternProperties(schema) ||
    S.IsPropertyNames(schema) ||
    S.IsMinProperties(schema) ||
    S.IsMaxProperties(schema) ||
    S.IsRequired(schema) ||
    S.IsUnevaluatedProperties(schema)
  )
}
// ----------------------------------------------------------------
// HasArray
// ----------------------------------------------------------------
function HasArrayType(schema: S.XSchema): boolean {
  return HasTypeName(schema, 'array')
}
function HasArrayKeywords(schema: S.XSchema): boolean {
  return S.IsSchema(schema) && (
    S.IsAdditionalItems(schema) ||
    S.IsItems(schema) ||
    S.IsContains(schema) ||
    S.IsMaxContains(schema) ||
    S.IsMaxItems(schema) ||
    S.IsMinContains(schema) ||
    S.IsMinItems(schema) ||
    S.IsPrefixItems(schema) ||
    S.IsUnevaluatedItems(schema) ||
    S.IsUniqueItems(schema)
  )
}
// ----------------------------------------------------------------
// HasString
// ----------------------------------------------------------------
function HasStringType(schema: S.XSchema): boolean {
  return HasTypeName(schema, 'string')
}
function HasStringKeywords(schema: S.XSchema): boolean {
  return S.IsSchema(schema) && (
    S.IsMinLength(schema) ||
    S.IsMaxLength(schema) ||
    S.IsFormat(schema) ||
    S.IsPattern(schema)
  )
}
// ----------------------------------------------------------------
// HasNumber
// ----------------------------------------------------------------
function HasNumberType(schema: S.XSchema): boolean {
  return HasTypeName(schema, 'number') || HasTypeName(schema, 'bigint') 
}
function HasNumberKeywords(schema: S.XSchema): boolean {
  return S.IsSchema(schema) && (
    S.IsMinimum(schema) ||
    S.IsMaximum(schema) ||
    S.IsExclusiveMaximum(schema) ||
    S.IsExclusiveMinimum(schema) ||
    S.IsMultipleOf(schema)
  )
}
// ----------------------------------------------------------------
// Build
// ----------------------------------------------------------------
export function BuildSchema(context: BuildContext, schema: S.XSchemaLike, value: string): string {
  const conditions: string[] = []
  if (S.IsBooleanSchema(schema)) return BuildBooleanSchema(context, schema, value)
  if (S.IsType(schema)) conditions.push(BuildType(context, schema, value))
  if (HasObjectKeywords(schema)) {
    const constraints = []
    if (S.IsRequired(schema)) constraints.push(BuildRequired(context, schema, value))
    if (S.IsAdditionalProperties(schema)) constraints.push(BuildAdditionalProperties(context, schema, value))
    if (S.IsDependencies(schema)) constraints.push(BuildDependencies(context, schema, value))
    if (S.IsDependentRequired(schema)) constraints.push(BuildDependentRequired(context, schema, value))
    if (S.IsDependentSchemas(schema)) constraints.push(BuildDependentSchemas(context, schema, value))
    if (S.IsPatternProperties(schema)) constraints.push(BuildPatternProperties(context, schema, value))
    if (S.IsProperties(schema)) constraints.push(BuildProperties(context, schema, value))
    if (S.IsPropertyNames(schema)) constraints.push(BuildPropertyNames(context, schema, value))
    if (S.IsMinProperties(schema)) constraints.push(BuildMinProperties(context, schema, value))
    if (S.IsMaxProperties(schema)) constraints.push(BuildMaxProperties(context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsObjectNotArray(value)), reduced)
    conditions.push(HasObjectType(schema) ? reduced : guarded)
  }
  if (HasArrayKeywords(schema)) {
    const constraints = []
    if (S.IsAdditionalItems(schema)) constraints.push(BuildAdditionalItems(context, schema, value))
    if (S.IsContains(schema)) constraints.push(BuildContains(context, schema, value))
    if (S.IsItems(schema)) constraints.push(BuildItems(context, schema, value))
    if (S.IsMaxContains(schema)) constraints.push(BuildMaxContains(context, schema, value))
    if (S.IsMaxItems(schema)) constraints.push(BuildMaxItems(context, schema, value))
    if (S.IsMinContains(schema)) constraints.push(BuildMinContains(context, schema, value))
    if (S.IsMinItems(schema)) constraints.push(BuildMinItems(context, schema, value))
    if (S.IsPrefixItems(schema)) constraints.push(BuildPrefixItems(context, schema, value))
    if (S.IsUniqueItems(schema)) constraints.push(BuildUniqueItems(context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsArray(value)), reduced)
    conditions.push(HasArrayType(schema) ? reduced : guarded)
  }
  if (HasStringKeywords(schema)) {
    const constraints = []
    if (S.IsFormat(schema)) constraints.push(BuildFormat(context, schema, value))
    if (S.IsMaxLength(schema)) constraints.push(BuildMaxLength(context, schema, value))
    if (S.IsMinLength(schema)) constraints.push(BuildMinLength(context, schema, value))
    if (S.IsPattern(schema)) constraints.push(BuildPattern(context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsString(value)), reduced)
    conditions.push(HasStringType(schema) ? reduced : guarded)
  }
  if (HasNumberKeywords(schema)) {
    const constraints = []
    if (S.IsExclusiveMaximum(schema)) constraints.push(BuildExclusiveMaximum(context, schema, value))
    if (S.IsExclusiveMinimum(schema)) constraints.push(BuildExclusiveMinimum(context, schema, value))
    if (S.IsMaximum(schema)) constraints.push(BuildMaximum(context, schema, value))
    if (S.IsMinimum(schema)) constraints.push(BuildMinimum(context, schema, value))
    if (S.IsMultipleOf(schema)) constraints.push(BuildMultipleOf(context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded =  E.Or(E.Not(E.Or(E.IsNumber(value), E.IsBigInt(value))), reduced)
    conditions.push(HasNumberType(schema) ? reduced : guarded)
  }
  if (S.IsRef(schema)) conditions.push(BuildRef(context, schema, value))
  if (S.IsGuard(schema)) conditions.push(BuildGuard(context, schema, value))
  if (S.IsConst(schema)) conditions.push(BuildConst(context, schema, value))
  if (S.IsEnum(schema)) conditions.push(BuildEnum(context, schema, value))
  if (S.IsIf(schema)) conditions.push(BuildIf(context, schema, value))
  if (S.IsNot(schema)) conditions.push(BuildNot(context, schema, value))
  if (S.IsAllOf(schema)) conditions.push(BuildAllOf(context, schema, value))
  if (S.IsAnyOf(schema)) conditions.push(BuildAnyOf(context, schema, value))
  if (S.IsOneOf(schema)) conditions.push(BuildOneOf(context, schema, value))
  if (S.IsUnevaluatedItems(schema)) conditions.push(E.Or(E.Not(E.IsArray(value)), BuildUnevaluatedItems(context, schema, value)))
  if (S.IsUnevaluatedProperties(schema)) conditions.push(E.Or(E.Not(E.IsObject(value)), BuildUnevaluatedProperties(context, schema, value)))
  if (S.IsRefine(schema)) conditions.push(BuildRefine(context, schema, value))
  return E.ReduceAnd(conditions)
}
// ----------------------------------------------------------------
// Check
// ----------------------------------------------------------------
export function CheckSchema(context: CheckContext, schema: S.XSchemaLike, value: unknown): boolean {
  return S.IsBooleanSchema(schema) ? CheckBooleanSchema(context, schema, value) : (
    (!S.IsType(schema) || CheckType(context, schema, value)) &&
    (!(G.IsObject(value) && !G.IsArray(value)) || (
      (!S.IsRequired(schema) || CheckRequired(context, schema, value)) &&
      (!S.IsAdditionalProperties(schema) || CheckAdditionalProperties(context, schema, value)) &&
      (!S.IsDependencies(schema) || CheckDependencies(context, schema, value)) &&
      (!S.IsDependentRequired(schema) || CheckDependentRequired(context, schema, value)) &&
      (!S.IsDependentSchemas(schema) || CheckDependentSchemas(context, schema, value)) &&
      (!S.IsPatternProperties(schema) || CheckPatternProperties(context, schema, value)) &&
      (!S.IsProperties(schema) || CheckProperties(context, schema, value)) &&
      (!S.IsPropertyNames(schema) || CheckPropertyNames(context, schema, value)) &&
      (!S.IsMinProperties(schema) || CheckMinProperties(context, schema, value)) &&
      (!S.IsMaxProperties(schema) || CheckMaxProperties(context, schema, value))
    )) &&
    (!G.IsArray(value) || (
      (!S.IsAdditionalItems(schema) || CheckAdditionalItems(context, schema, value)) &&
      (!S.IsContains(schema) || CheckContains(context, schema, value)) &&
      (!S.IsItems(schema) || CheckItems(context, schema, value)) &&
      (!S.IsMaxContains(schema) || CheckMaxContains(context, schema, value)) &&
      (!S.IsMaxItems(schema) || CheckMaxItems(context, schema, value)) &&
      (!S.IsMinContains(schema) || CheckMinContains(context, schema, value)) &&
      (!S.IsMinItems(schema) || CheckMinItems(context, schema, value)) &&
      (!S.IsPrefixItems(schema) || CheckPrefixItems(context, schema, value)) &&
      (!S.IsUniqueItems(schema) || CheckUniqueItems(context, schema, value))
    )) &&
    (!G.IsString(value) || (
      (!S.IsFormat(schema) || CheckFormat(context, schema, value)) &&
      (!S.IsMaxLength(schema) || CheckMaxLength(context, schema, value)) &&
      (!S.IsMinLength(schema) || CheckMinLength(context, schema, value)) &&
      (!S.IsPattern(schema) || CheckPattern(context, schema, value))
    )) &&
    (!(G.IsNumber(value) || G.IsBigInt(value)) || (
      (!S.IsExclusiveMaximum(schema) || CheckExclusiveMaximum(context, schema, value)) &&
      (!S.IsExclusiveMinimum(schema) || CheckExclusiveMinimum(context, schema, value)) &&
      (!S.IsMaximum(schema) || CheckMaximum(context, schema, value)) &&
      (!S.IsMinimum(schema) || CheckMinimum(context, schema, value)) &&
      (!S.IsMultipleOf(schema) || CheckMultipleOf(context, schema, value))
    )) &&
    (!S.IsRef(schema) || CheckRef(context, schema, value)) &&
    (!S.IsGuard(schema) || CheckGuard(context, schema, value)) &&
    (!S.IsConst(schema) || CheckConst(context, schema, value)) &&
    (!S.IsEnum(schema) || CheckEnum(context, schema, value)) &&
    (!S.IsIf(schema) || CheckIf(context, schema, value)) &&
    (!S.IsNot(schema) || CheckNot(context, schema, value)) &&
    (!S.IsAllOf(schema) || CheckAllOf(context, schema, value)) &&
    (!S.IsAnyOf(schema) || CheckAnyOf(context, schema, value)) &&
    (!S.IsOneOf(schema) || CheckOneOf(context, schema, value)) &&
    (!S.IsUnevaluatedItems(schema) || (!G.IsArray(value) || CheckUnevaluatedItems(context, schema, value))) &&
    (!S.IsUnevaluatedProperties(schema) || (!G.IsObject(value) || CheckUnevaluatedProperties(context, schema, value))) &&
    (!S.IsRefine(schema) || CheckRefine(context, schema, value))
  )
}
// ----------------------------------------------------------------
// Error
// ----------------------------------------------------------------
export function ErrorSchema(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XSchemaLike, value: unknown): boolean {
  return (S.IsBooleanSchema(schema)) ? ErrorBooleanSchema(context, schemaPath, instancePath, schema, value) : (
    !!(
      +(!S.IsType(schema) || ErrorType(context, schemaPath, instancePath, schema, value)) &
      +(!(G.IsObject(value) && !G.IsArray(value)) || !!(
        +(!S.IsRequired(schema) || ErrorRequired(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsAdditionalProperties(schema) || ErrorAdditionalProperties(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsDependencies(schema) || ErrorDependencies(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsDependentRequired(schema) || ErrorDependentRequired(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsDependentSchemas(schema) || ErrorDependentSchemas(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPatternProperties(schema) || ErrorPatternProperties(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsProperties(schema) || ErrorProperties(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPropertyNames(schema) || ErrorPropertyNames(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinProperties(schema) || ErrorMinProperties(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxProperties(schema) || ErrorMaxProperties(context, schemaPath, instancePath, schema, value))
      )) &
      +(!G.IsArray(value) || !!(
        +(!S.IsAdditionalItems(schema) || ErrorAdditionalItems(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsContains(schema) || ErrorContains(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsItems(schema) || ErrorItems(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxContains(schema) || ErrorMaxContains(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxItems(schema) || ErrorMaxItems(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinContains(schema) || ErrorMinContains(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinItems(schema) || ErrorMinItems(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPrefixItems(schema) || ErrorPrefixItems(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsUniqueItems(schema) || ErrorUniqueItems(context, schemaPath, instancePath, schema, value))
      )) &
      +(!G.IsString(value) || !!(
        +(!S.IsFormat(schema) || ErrorFormat(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxLength(schema) || ErrorMaxLength(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinLength(schema) || ErrorMinLength(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPattern(schema) || ErrorPattern(context, schemaPath, instancePath, schema, value))
      )) &
      +(!(G.IsNumber(value) || G.IsBigInt(value)) || !!(
        +(!S.IsExclusiveMaximum(schema) || ErrorExclusiveMaximum(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsExclusiveMinimum(schema) || ErrorExclusiveMinimum(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaximum(schema) || ErrorMaximum(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinimum(schema) || ErrorMinimum(context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMultipleOf(schema) || ErrorMultipleOf(context, schemaPath, instancePath, schema, value))
      )) &
      +(!S.IsRef(schema) || ErrorRef(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsGuard(schema) || ErrorGuard(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsConst(schema) || ErrorConst(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsEnum(schema) || ErrorEnum(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsIf(schema) || ErrorIf(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsNot(schema) || ErrorNot(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsAllOf(schema) || ErrorAllOf(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsAnyOf(schema) || ErrorAnyOf(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsOneOf(schema) || ErrorOneOf(context, schemaPath, instancePath, schema, value)) &
      +(!S.IsUnevaluatedItems(schema) || (!G.IsArray(value) || ErrorUnevaluatedItems(context, schemaPath, instancePath, schema, value))) &
      +(!S.IsUnevaluatedProperties(schema) || (!G.IsObject(value) || ErrorUnevaluatedProperties(context, schemaPath, instancePath, schema, value)))
    ) &&
    (!S.IsRefine(schema) || ErrorRefine(context, schemaPath, instancePath, schema, value))
  )
}
