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
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { BuildRefine, CheckRefine, ErrorRefine } from './_refine.ts'
import { BuildGuard, CheckGuard, ErrorGuard } from './_guard.ts'

import { EmitGuard as E, Guard as G } from '../../guard/index.ts'

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
import { BuildRecursiveRef, CheckRecursiveRef, ErrorRecursiveRef } from './recursiveRef.ts'
import { BuildRef, CheckRef, ErrorRef } from './ref.ts'
import { BuildRequired, CheckRequired, ErrorRequired } from './required.ts'
import { BuildType, CheckType, ErrorType } from './type.ts'
import { BuildUnevaluatedItems, CheckUnevaluatedItems, ErrorUnevaluatedItems } from './unevaluatedItems.ts'
import { BuildUnevaluatedProperties, CheckUnevaluatedProperties, ErrorUnevaluatedProperties } from './unevaluatedProperties.ts'
import { BuildUniqueItems, CheckUniqueItems, ErrorUniqueItems } from './uniqueItems.ts'

// ----------------------------------------------------------------
// HasTypeName
// ----------------------------------------------------------------
function HasTypeName(schema: S.XSchemaObject, typename: string): boolean {
  return S.IsType(schema) &&
    (G.IsArray(schema.type) && schema.type.includes(typename) ||
      G.IsEqual(schema.type, typename))
}
// ----------------------------------------------------------------
// HasObject
// ----------------------------------------------------------------
function HasObjectType(schema: S.XSchemaObject): boolean {
  return HasTypeName(schema, 'object')
}
function HasObjectKeywords(schema: S.XSchemaObject): boolean {
  return S.IsSchemaObject(schema) && (
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
function HasArrayType(schema: S.XSchemaObject): boolean {
  return HasTypeName(schema, 'array')
}
function HasArrayKeywords(schema: S.XSchemaObject): boolean {
  return S.IsSchemaObject(schema) && (
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
function HasStringType(schema: S.XSchemaObject): boolean {
  return HasTypeName(schema, 'string')
}
function HasStringKeywords(schema: S.XSchemaObject): boolean {
  return S.IsSchemaObject(schema) && (
    S.IsMinLength(schema) ||
    S.IsMaxLength(schema) ||
    S.IsFormat(schema) ||
    S.IsPattern(schema)
  )
}
// ----------------------------------------------------------------
// HasNumber
// ----------------------------------------------------------------
function HasNumberType(schema: S.XSchemaObject): boolean {
  return HasTypeName(schema, 'number') || HasTypeName(schema, 'bigint')
}
function HasNumberKeywords(schema: S.XSchemaObject): boolean {
  return S.IsSchemaObject(schema) && (
    S.IsMinimum(schema) ||
    S.IsMaximum(schema) ||
    S.IsExclusiveMaximum(schema) ||
    S.IsExclusiveMinimum(schema) ||
    S.IsMultipleOf(schema)
  )
}
// ------------------------------------------------------------------
// PushStack
// ------------------------------------------------------------------
function PushStack(stack: Stack, schema: S.XSchema) {
  if (S.IsSchemaObject(schema)) {
    if (S.IsAnchor(schema)) stack.Anchors.Push(schema)
    if (S.IsId(schema)) stack.Ids.Push(schema)
    if (S.IsRef(schema)) stack.Refs.Push(schema)
    if (S.IsRecursiveAnchorTrue(schema)) stack.RecursiveAnchors.Push(schema)
    if (S.IsDynamicAnchor(schema)) stack.DynamicAnchors.Push(schema)
  }
}
// ------------------------------------------------------------------
// PopStack
// ------------------------------------------------------------------
function PopStack(stack: Stack, schema: S.XSchema) {
  if (S.IsSchemaObject(schema)) {
    if (S.IsAnchor(schema)) stack.Anchors.Pop()
    if (S.IsId(schema)) stack.Ids.Pop()
    if (S.IsRef(schema)) stack.Refs.Pop()
    if (S.IsRecursiveAnchorTrue(schema)) stack.RecursiveAnchors.Pop()
    if (S.IsDynamicAnchor(schema)) stack.DynamicAnchors.Pop()
  }
}
// ----------------------------------------------------------------
// Build
// ----------------------------------------------------------------
export function BuildSchema(stack: Stack, context: BuildContext, schema: S.XSchema, value: string): string {
  PushStack(stack, schema)
  const conditions: string[] = []
  if (S.IsBooleanSchema(schema)) return BuildBooleanSchema(stack, context, schema, value)
  if (S.IsType(schema)) conditions.push(BuildType(stack, context, schema, value))
  if (HasObjectKeywords(schema)) {
    const constraints = []
    if (S.IsRequired(schema)) constraints.push(BuildRequired(stack, context, schema, value))
    if (S.IsAdditionalProperties(schema)) constraints.push(BuildAdditionalProperties(stack, context, schema, value))
    if (S.IsDependencies(schema)) constraints.push(BuildDependencies(stack, context, schema, value))
    if (S.IsDependentRequired(schema)) constraints.push(BuildDependentRequired(stack, context, schema, value))
    if (S.IsDependentSchemas(schema)) constraints.push(BuildDependentSchemas(stack, context, schema, value))
    if (S.IsPatternProperties(schema)) constraints.push(BuildPatternProperties(stack, context, schema, value))
    if (S.IsProperties(schema)) constraints.push(BuildProperties(stack, context, schema, value))
    if (S.IsPropertyNames(schema)) constraints.push(BuildPropertyNames(stack, context, schema, value))
    if (S.IsMinProperties(schema)) constraints.push(BuildMinProperties(stack, context, schema, value))
    if (S.IsMaxProperties(schema)) constraints.push(BuildMaxProperties(stack, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsObjectNotArray(value)), reduced)
    conditions.push(HasObjectType(schema) ? reduced : guarded)
  }
  if (HasArrayKeywords(schema)) {
    const constraints = []
    if (S.IsAdditionalItems(schema)) constraints.push(BuildAdditionalItems(stack, context, schema, value))
    if (S.IsContains(schema)) constraints.push(BuildContains(stack, context, schema, value))
    if (S.IsItems(schema)) constraints.push(BuildItems(stack, context, schema, value))
    if (S.IsMaxContains(schema)) constraints.push(BuildMaxContains(stack, context, schema, value))
    if (S.IsMaxItems(schema)) constraints.push(BuildMaxItems(stack, context, schema, value))
    if (S.IsMinContains(schema)) constraints.push(BuildMinContains(stack, context, schema, value))
    if (S.IsMinItems(schema)) constraints.push(BuildMinItems(stack, context, schema, value))
    if (S.IsPrefixItems(schema)) constraints.push(BuildPrefixItems(stack, context, schema, value))
    if (S.IsUniqueItems(schema)) constraints.push(BuildUniqueItems(stack, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsArray(value)), reduced)
    conditions.push(HasArrayType(schema) ? reduced : guarded)
  }
  if (HasStringKeywords(schema)) {
    const constraints = []
    if (S.IsFormat(schema)) constraints.push(BuildFormat(stack, context, schema, value))
    if (S.IsMaxLength(schema)) constraints.push(BuildMaxLength(stack, context, schema, value))
    if (S.IsMinLength(schema)) constraints.push(BuildMinLength(stack, context, schema, value))
    if (S.IsPattern(schema)) constraints.push(BuildPattern(stack, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsString(value)), reduced)
    conditions.push(HasStringType(schema) ? reduced : guarded)
  }
  if (HasNumberKeywords(schema)) {
    const constraints = []
    if (S.IsExclusiveMaximum(schema)) constraints.push(BuildExclusiveMaximum(stack, context, schema, value))
    if (S.IsExclusiveMinimum(schema)) constraints.push(BuildExclusiveMinimum(stack, context, schema, value))
    if (S.IsMaximum(schema)) constraints.push(BuildMaximum(stack, context, schema, value))
    if (S.IsMinimum(schema)) constraints.push(BuildMinimum(stack, context, schema, value))
    if (S.IsMultipleOf(schema)) constraints.push(BuildMultipleOf(stack, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.Or(E.IsNumber(value), E.IsBigInt(value))), reduced)
    conditions.push(HasNumberType(schema) ? reduced : guarded)
  }
  if (S.IsRecursiveRef(schema)) conditions.push(BuildRecursiveRef(stack, context, schema, value))
  if (S.IsRef(schema)) conditions.push(BuildRef(stack, context, schema, value))
  if (S.IsGuard(schema)) conditions.push(BuildGuard(stack, context, schema, value))
  if (S.IsConst(schema)) conditions.push(BuildConst(stack, context, schema, value))
  if (S.IsEnum(schema)) conditions.push(BuildEnum(stack, context, schema, value))
  if (S.IsIf(schema)) conditions.push(BuildIf(stack, context, schema, value))
  if (S.IsNot(schema)) conditions.push(BuildNot(stack, context, schema, value))
  if (S.IsAllOf(schema)) conditions.push(BuildAllOf(stack, context, schema, value))
  if (S.IsAnyOf(schema)) conditions.push(BuildAnyOf(stack, context, schema, value))
  if (S.IsOneOf(schema)) conditions.push(BuildOneOf(stack, context, schema, value))
  if (S.IsUnevaluatedItems(schema)) conditions.push(E.Or(E.Not(E.IsArray(value)), BuildUnevaluatedItems(stack, context, schema, value)))
  if (S.IsUnevaluatedProperties(schema)) conditions.push(E.Or(E.Not(E.IsObject(value)), BuildUnevaluatedProperties(stack, context, schema, value)))
  if (S.IsRefine(schema)) conditions.push(BuildRefine(stack, context, schema, value))
  const result = E.ReduceAnd(conditions)
  PopStack(stack, schema)
  return result
}
// ----------------------------------------------------------------
// Check
// ----------------------------------------------------------------
export function CheckSchema(stack: Stack, context: CheckContext, schema: S.XSchema, value: unknown): boolean {
  PushStack(stack, schema)
  const result = S.IsBooleanSchema(schema) ? CheckBooleanSchema(stack, context, schema, value) : (
    (!S.IsType(schema) || CheckType(stack, context, schema, value)) &&
    (!(G.IsObject(value) && !G.IsArray(value)) || (
      (!S.IsRequired(schema) || CheckRequired(stack, context, schema, value)) &&
      (!S.IsAdditionalProperties(schema) || CheckAdditionalProperties(stack, context, schema, value)) &&
      (!S.IsDependencies(schema) || CheckDependencies(stack, context, schema, value)) &&
      (!S.IsDependentRequired(schema) || CheckDependentRequired(stack, context, schema, value)) &&
      (!S.IsDependentSchemas(schema) || CheckDependentSchemas(stack, context, schema, value)) &&
      (!S.IsPatternProperties(schema) || CheckPatternProperties(stack, context, schema, value)) &&
      (!S.IsProperties(schema) || CheckProperties(stack, context, schema, value)) &&
      (!S.IsPropertyNames(schema) || CheckPropertyNames(stack, context, schema, value)) &&
      (!S.IsMinProperties(schema) || CheckMinProperties(stack, context, schema, value)) &&
      (!S.IsMaxProperties(schema) || CheckMaxProperties(stack, context, schema, value))
    )) &&
    (!G.IsArray(value) || (
      (!S.IsAdditionalItems(schema) || CheckAdditionalItems(stack, context, schema, value)) &&
      (!S.IsContains(schema) || CheckContains(stack, context, schema, value)) &&
      (!S.IsItems(schema) || CheckItems(stack, context, schema, value)) &&
      (!S.IsMaxContains(schema) || CheckMaxContains(stack, context, schema, value)) &&
      (!S.IsMaxItems(schema) || CheckMaxItems(stack, context, schema, value)) &&
      (!S.IsMinContains(schema) || CheckMinContains(stack, context, schema, value)) &&
      (!S.IsMinItems(schema) || CheckMinItems(stack, context, schema, value)) &&
      (!S.IsPrefixItems(schema) || CheckPrefixItems(stack, context, schema, value)) &&
      (!S.IsUniqueItems(schema) || CheckUniqueItems(stack, context, schema, value))
    )) &&
    (!G.IsString(value) || (
      (!S.IsFormat(schema) || CheckFormat(stack, context, schema, value)) &&
      (!S.IsMaxLength(schema) || CheckMaxLength(stack, context, schema, value)) &&
      (!S.IsMinLength(schema) || CheckMinLength(stack, context, schema, value)) &&
      (!S.IsPattern(schema) || CheckPattern(stack, context, schema, value))
    )) &&
    (!(G.IsNumber(value) || G.IsBigInt(value)) || (
      (!S.IsExclusiveMaximum(schema) || CheckExclusiveMaximum(stack, context, schema, value)) &&
      (!S.IsExclusiveMinimum(schema) || CheckExclusiveMinimum(stack, context, schema, value)) &&
      (!S.IsMaximum(schema) || CheckMaximum(stack, context, schema, value)) &&
      (!S.IsMinimum(schema) || CheckMinimum(stack, context, schema, value)) &&
      (!S.IsMultipleOf(schema) || CheckMultipleOf(stack, context, schema, value))
    )) &&
    (!S.IsRecursiveRef(schema) || CheckRecursiveRef(stack, context, schema, value)) &&
    (!S.IsRef(schema) || CheckRef(stack, context, schema, value)) &&
    (!S.IsGuard(schema) || CheckGuard(stack, context, schema, value)) &&
    (!S.IsConst(schema) || CheckConst(stack, context, schema, value)) &&
    (!S.IsEnum(schema) || CheckEnum(stack, context, schema, value)) &&
    (!S.IsIf(schema) || CheckIf(stack, context, schema, value)) &&
    (!S.IsNot(schema) || CheckNot(stack, context, schema, value)) &&
    (!S.IsAllOf(schema) || CheckAllOf(stack, context, schema, value)) &&
    (!S.IsAnyOf(schema) || CheckAnyOf(stack, context, schema, value)) &&
    (!S.IsOneOf(schema) || CheckOneOf(stack, context, schema, value)) &&
    (!S.IsUnevaluatedItems(schema) || (!G.IsArray(value) || CheckUnevaluatedItems(stack, context, schema, value))) &&
    (!S.IsUnevaluatedProperties(schema) || (!G.IsObject(value) || CheckUnevaluatedProperties(stack, context, schema, value))) &&
    (!S.IsRefine(schema) || CheckRefine(stack, context, schema, value))
  )
  PopStack(stack, schema)
  return result
}
// ----------------------------------------------------------------
// Error
// ----------------------------------------------------------------
export function ErrorSchema(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XSchema, value: unknown): boolean {
  PushStack(stack, schema)
  const result = (S.IsBooleanSchema(schema)) ? ErrorBooleanSchema(stack, context, schemaPath, instancePath, schema, value) : (
    !!(
      +(!S.IsType(schema) || ErrorType(stack, context, schemaPath, instancePath, schema, value)) &
      +(!(G.IsObject(value) && !G.IsArray(value)) || !!(
        +(!S.IsRequired(schema) || ErrorRequired(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsAdditionalProperties(schema) || ErrorAdditionalProperties(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsDependencies(schema) || ErrorDependencies(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsDependentRequired(schema) || ErrorDependentRequired(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsDependentSchemas(schema) || ErrorDependentSchemas(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPatternProperties(schema) || ErrorPatternProperties(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsProperties(schema) || ErrorProperties(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPropertyNames(schema) || ErrorPropertyNames(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinProperties(schema) || ErrorMinProperties(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxProperties(schema) || ErrorMaxProperties(stack, context, schemaPath, instancePath, schema, value))
      )) &
      +(!G.IsArray(value) || !!(
        +(!S.IsAdditionalItems(schema) || ErrorAdditionalItems(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsContains(schema) || ErrorContains(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsItems(schema) || ErrorItems(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxContains(schema) || ErrorMaxContains(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxItems(schema) || ErrorMaxItems(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinContains(schema) || ErrorMinContains(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinItems(schema) || ErrorMinItems(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPrefixItems(schema) || ErrorPrefixItems(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsUniqueItems(schema) || ErrorUniqueItems(stack, context, schemaPath, instancePath, schema, value))
      )) &
      +(!G.IsString(value) || !!(
        +(!S.IsFormat(schema) || ErrorFormat(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaxLength(schema) || ErrorMaxLength(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinLength(schema) || ErrorMinLength(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsPattern(schema) || ErrorPattern(stack, context, schemaPath, instancePath, schema, value))
      )) &
      +(!(G.IsNumber(value) || G.IsBigInt(value)) || !!(
        +(!S.IsExclusiveMaximum(schema) || ErrorExclusiveMaximum(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsExclusiveMinimum(schema) || ErrorExclusiveMinimum(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMaximum(schema) || ErrorMaximum(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMinimum(schema) || ErrorMinimum(stack, context, schemaPath, instancePath, schema, value)) &
        +(!S.IsMultipleOf(schema) || ErrorMultipleOf(stack, context, schemaPath, instancePath, schema, value))
      )) &
      +(!S.IsRecursiveRef(schema) || ErrorRecursiveRef(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsRef(schema) || ErrorRef(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsGuard(schema) || ErrorGuard(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsConst(schema) || ErrorConst(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsEnum(schema) || ErrorEnum(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsIf(schema) || ErrorIf(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsNot(schema) || ErrorNot(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsAllOf(schema) || ErrorAllOf(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsAnyOf(schema) || ErrorAnyOf(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsOneOf(schema) || ErrorOneOf(stack, context, schemaPath, instancePath, schema, value)) &
      +(!S.IsUnevaluatedItems(schema) || (!G.IsArray(value) || ErrorUnevaluatedItems(stack, context, schemaPath, instancePath, schema, value))) &
      +(!S.IsUnevaluatedProperties(schema) || (!G.IsObject(value) || ErrorUnevaluatedProperties(stack, context, schemaPath, instancePath, schema, value)))
    ) &&
    (!S.IsRefine(schema) || ErrorRefine(stack, context, schemaPath, instancePath, schema, value))
  )
  PopStack(stack, schema)
  return result
}
