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

// deno-fmt-ignore-file

import * as Schema from '../types/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { BuildRefine, CheckRefine, ErrorRefine } from './_refine.ts'
import * as Stack from './_stack.ts'

import { EmitGuard as E, Guard as G } from '../../guard/index.ts'

import { BuildAdditionalItems, CheckAdditionalItems, ErrorAdditionalItems } from './additionalItems.ts'
import { BuildAdditionalProperties, CheckAdditionalProperties, ErrorAdditionalProperties } from './additionalProperties.ts'
import { BuildAllOf, CheckAllOf, ErrorAllOf } from './allOf.ts'
import { BuildAnyOf, CheckAnyOf, ErrorAnyOf } from './anyOf.ts'
import { BuildSchemaBoolean, CheckSchemaBoolean, ErrorSchemaBoolean } from './boolean.ts'
import { BuildConst, CheckConst, ErrorConst } from './const.ts'
import { BuildContains, CheckContains, ErrorContains } from './contains.ts'
import { BuildDependencies, CheckDependencies, ErrorDependencies } from './dependencies.ts'
import { BuildDependentRequired, CheckDependentRequired, ErrorDependentRequired } from './dependentRequired.ts'
import { BuildDependentSchemas, CheckDependentSchemas, ErrorDependentSchemas } from './dependentSchemas.ts'
import { BuildDynamicRef, CheckDynamicRef, ErrorDynamicRef } from './dynamicRef.ts'
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
// HasTypeName (Optimization)
//
// We only consider a schema as having a type name when the schema 
// has a single type string, or when every element in the type 
// array is the same. For a type array, we must treat multi-variant 
// types as unions and therefore can NOT use an optimized forward 
// type check.
//
// ----------------------------------------------------------------
function HasTypeName(schema: Schema.XSchemaObject, typename: string): boolean {
  return (
    Schema.IsType(schema) &&
    (
      (G.IsArray(schema.type) &&
        G.IsGreaterThan(schema.type.length, 0) &&
        G.Every(schema.type, 0, type => G.IsEqual(type, typename))) ||
      G.IsEqual(schema.type, typename)
    )
  )
}
// ----------------------------------------------------------------
// HasObject
// ----------------------------------------------------------------
function HasObjectType(schema: Schema.XSchemaObject): boolean {
  return HasTypeName(schema, 'object')
}
function HasObjectKeywords(schema: Schema.XSchemaObject): boolean {
  return Schema.IsSchemaObject(schema) && (
    Schema.IsAdditionalProperties(schema) ||
    Schema.IsDependencies(schema) ||
    Schema.IsDependentRequired(schema) ||
    Schema.IsDependentSchemas(schema) ||
    Schema.IsProperties(schema) ||
    Schema.IsPatternProperties(schema) ||
    Schema.IsPropertyNames(schema) ||
    Schema.IsMinProperties(schema) ||
    Schema.IsMaxProperties(schema) ||
    Schema.IsRequired(schema) ||
    Schema.IsUnevaluatedProperties(schema)
  )
}
// ----------------------------------------------------------------
// HasArray
// ----------------------------------------------------------------
function HasArrayType(schema: Schema.XSchemaObject): boolean {
  return HasTypeName(schema, 'array')
}
function HasArrayKeywords(schema: Schema.XSchemaObject): boolean {
  return Schema.IsSchemaObject(schema) && (
    Schema.IsAdditionalItems(schema) ||
    Schema.IsItems(schema) ||
    Schema.IsContains(schema) ||
    Schema.IsMaxContains(schema) ||
    Schema.IsMaxItems(schema) ||
    Schema.IsMinContains(schema) ||
    Schema.IsMinItems(schema) ||
    Schema.IsPrefixItems(schema) ||
    Schema.IsUnevaluatedItems(schema) ||
    Schema.IsUniqueItems(schema)
  )
}
// ----------------------------------------------------------------
// HasString
// ----------------------------------------------------------------
function HasStringType(schema: Schema.XSchemaObject): boolean {
  return HasTypeName(schema, 'string')
}
function HasStringKeywords(schema: Schema.XSchemaObject): boolean {
  return Schema.IsSchemaObject(schema) && (
    Schema.IsMinLength(schema) ||
    Schema.IsMaxLength(schema) ||
    Schema.IsFormat(schema) ||
    Schema.IsPattern(schema)
  )
}
// ----------------------------------------------------------------
// HasNumber
// ----------------------------------------------------------------
function HasNumberType(schema: Schema.XSchemaObject): boolean {
  return HasTypeName(schema, 'number') || HasTypeName(schema, 'bigint')
}
function HasNumberKeywords(schema: Schema.XSchemaObject): boolean {
  return Schema.IsSchemaObject(schema) && (
    Schema.IsMinimum(schema) ||
    Schema.IsMaximum(schema) ||
    Schema.IsExclusiveMaximum(schema) ||
    Schema.IsExclusiveMinimum(schema) ||
    Schema.IsMultipleOf(schema)
  )
}
// ----------------------------------------------------------------
// Build
// ----------------------------------------------------------------
export function BuildSchemaPushStack(stack: Stack.XStack, context: BuildContext, schema: Schema.XSchema, value: string) {
  return context.UseUnevaluated()
    ? E.And(E.And(context.Push(), BuildSchema(stack, context, schema, value)), context.Pop())
    : BuildSchema(stack, context, schema, value)
}
export function BuildSchema(stack: Stack.XStack, context: BuildContext, schema: Schema.XSchema, value: string): string {
  const current = Stack.NextStack(stack, schema)
  const conditions: string[] = []
  if (Schema.IsSchemaBoolean(schema)) return BuildSchemaBoolean(current, context, schema, value)
  if (Schema.IsType(schema)) conditions.push(BuildType(current, context, schema, value))
  if (HasObjectKeywords(schema)) {
    const constraints = []
    if (Schema.IsRequired(schema)) constraints.push(BuildRequired(current, context, schema, value))
    if (Schema.IsAdditionalProperties(schema)) constraints.push(BuildAdditionalProperties(current, context, schema, value))
    if (Schema.IsDependencies(schema)) constraints.push(BuildDependencies(current, context, schema, value))
    if (Schema.IsDependentRequired(schema)) constraints.push(BuildDependentRequired(current, context, schema, value))
    if (Schema.IsDependentSchemas(schema)) constraints.push(BuildDependentSchemas(current, context, schema, value))
    if (Schema.IsPatternProperties(schema)) constraints.push(BuildPatternProperties(current, context, schema, value))
    if (Schema.IsProperties(schema)) constraints.push(BuildProperties(current, context, schema, value))
    if (Schema.IsPropertyNames(schema)) constraints.push(BuildPropertyNames(current, context, schema, value))
    if (Schema.IsMinProperties(schema)) constraints.push(BuildMinProperties(current, context, schema, value))
    if (Schema.IsMaxProperties(schema)) constraints.push(BuildMaxProperties(current, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsObjectNotArray(value)), reduced)
    conditions.push(HasObjectType(schema) ? reduced : guarded)
  }
  if (HasArrayKeywords(schema)) {
    const constraints = []
    if (Schema.IsAdditionalItems(schema)) constraints.push(BuildAdditionalItems(current, context, schema, value))
    if (Schema.IsContains(schema)) constraints.push(BuildContains(current, context, schema, value))
    if (Schema.IsItems(schema)) constraints.push(BuildItems(current, context, schema, value))
    if (Schema.IsMaxContains(schema)) constraints.push(BuildMaxContains(current, context, schema, value))
    if (Schema.IsMaxItems(schema)) constraints.push(BuildMaxItems(current, context, schema, value))
    if (Schema.IsMinContains(schema)) constraints.push(BuildMinContains(current, context, schema, value))
    if (Schema.IsMinItems(schema)) constraints.push(BuildMinItems(current, context, schema, value))
    if (Schema.IsPrefixItems(schema)) constraints.push(BuildPrefixItems(current, context, schema, value))
    if (Schema.IsUniqueItems(schema)) constraints.push(BuildUniqueItems(current, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsArray(value)), reduced)
    conditions.push(HasArrayType(schema) ? reduced : guarded)
  }
  if (HasStringKeywords(schema)) {
    const constraints = []
    if (Schema.IsMaxLength(schema)) constraints.push(BuildMaxLength(current, context, schema, value))
    if (Schema.IsMinLength(schema)) constraints.push(BuildMinLength(current, context, schema, value))
    if (Schema.IsFormat(schema)) constraints.push(BuildFormat(current, context, schema, value))
    if (Schema.IsPattern(schema)) constraints.push(BuildPattern(current, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.IsString(value)), reduced)
    conditions.push(HasStringType(schema) ? reduced : guarded)
  }
  if (HasNumberKeywords(schema)) {
    const constraints = []
    if (Schema.IsExclusiveMaximum(schema)) constraints.push(BuildExclusiveMaximum(current, context, schema, value))
    if (Schema.IsExclusiveMinimum(schema)) constraints.push(BuildExclusiveMinimum(current, context, schema, value))
    if (Schema.IsMaximum(schema)) constraints.push(BuildMaximum(current, context, schema, value))
    if (Schema.IsMinimum(schema)) constraints.push(BuildMinimum(current, context, schema, value))
    if (Schema.IsMultipleOf(schema)) constraints.push(BuildMultipleOf(current, context, schema, value))
    const reduced = E.ReduceAnd(constraints)
    const guarded = E.Or(E.Not(E.Or(E.IsNumber(value), E.IsBigInt(value))), reduced)
    conditions.push(HasNumberType(schema) ? reduced : guarded)
  }
  if (Schema.IsRef(schema)) conditions.push(BuildRef(current, context, schema, value))
  if (Schema.IsRecursiveRef(schema)) conditions.push(BuildRecursiveRef(current, context, schema, value))
  if (Schema.IsDynamicRef(schema)) conditions.push(BuildDynamicRef(current, context, schema, value))
  if (Schema.IsConst(schema)) conditions.push(BuildConst(current, context, schema, value))
  if (Schema.IsEnum(schema)) conditions.push(BuildEnum(current, context, schema, value))
  if (Schema.IsIf(schema)) conditions.push(BuildIf(current, context, schema, value))
  if (Schema.IsNot(schema)) conditions.push(BuildNot(current, context, schema, value))
  if (Schema.IsAllOf(schema)) conditions.push(BuildAllOf(current, context, schema, value))
  if (Schema.IsAnyOf(schema)) conditions.push(BuildAnyOf(current, context, schema, value))
  if (Schema.IsOneOf(schema)) conditions.push(BuildOneOf(current, context, schema, value))
  if (Schema.IsUnevaluatedItems(schema)) conditions.push(E.Or(E.Not(E.IsArray(value)), BuildUnevaluatedItems(current, context, schema, value)))
  if (Schema.IsUnevaluatedProperties(schema)) conditions.push(E.Or(E.Not(E.IsObject(value)), BuildUnevaluatedProperties(current, context, schema, value)))
  if (Schema.IsRefine(schema)) conditions.push(BuildRefine(current, context, schema, value))
  const result = E.ReduceAnd(conditions)
  return result
}
// ----------------------------------------------------------------
// Check
// ----------------------------------------------------------------
export function CheckSchemaPushStack(stack: Stack.XStack, context: CheckContext, schema: Schema.XSchema, value: unknown): boolean {
  return (context.Push() && CheckSchema(stack, context, schema, value)) && context.Pop()
}
export function CheckSchema(stack: Stack.XStack, context: CheckContext, schema: Schema.XSchema, value: unknown): boolean {
  const current = Stack.NextStack(stack, schema)
  const result = Schema.IsSchemaBoolean(schema) ? CheckSchemaBoolean(current, context, schema, value) : (
    (!Schema.IsType(schema) || CheckType(current, context, schema, value)) &&
    (!(G.IsObject(value) && !G.IsArray(value)) || (
      (!Schema.IsRequired(schema) || CheckRequired(current, context, schema, value)) &&
      (!Schema.IsAdditionalProperties(schema) || CheckAdditionalProperties(current, context, schema, value)) &&
      (!Schema.IsDependencies(schema) || CheckDependencies(current, context, schema, value)) &&
      (!Schema.IsDependentRequired(schema) || CheckDependentRequired(current, context, schema, value)) &&
      (!Schema.IsDependentSchemas(schema) || CheckDependentSchemas(current, context, schema, value)) &&
      (!Schema.IsPatternProperties(schema) || CheckPatternProperties(current, context, schema, value)) &&
      (!Schema.IsProperties(schema) || CheckProperties(current, context, schema, value)) &&
      (!Schema.IsPropertyNames(schema) || CheckPropertyNames(current, context, schema, value)) &&
      (!Schema.IsMinProperties(schema) || CheckMinProperties(current, context, schema, value)) &&
      (!Schema.IsMaxProperties(schema) || CheckMaxProperties(current, context, schema, value))
    )) &&
    (!G.IsArray(value) || (
      (!Schema.IsAdditionalItems(schema) || CheckAdditionalItems(current, context, schema, value)) &&
      (!Schema.IsContains(schema) || CheckContains(current, context, schema, value)) &&
      (!Schema.IsItems(schema) || CheckItems(current, context, schema, value)) &&
      (!Schema.IsMaxContains(schema) || CheckMaxContains(current, context, schema, value)) &&
      (!Schema.IsMaxItems(schema) || CheckMaxItems(current, context, schema, value)) &&
      (!Schema.IsMinContains(schema) || CheckMinContains(current, context, schema, value)) &&
      (!Schema.IsMinItems(schema) || CheckMinItems(current, context, schema, value)) &&
      (!Schema.IsPrefixItems(schema) || CheckPrefixItems(current, context, schema, value)) &&
      (!Schema.IsUniqueItems(schema) || CheckUniqueItems(current, context, schema, value))
    )) &&
    (!G.IsString(value) || (
      (!Schema.IsMaxLength(schema) || CheckMaxLength(current, context, schema, value)) &&
      (!Schema.IsMinLength(schema) || CheckMinLength(current, context, schema, value)) &&
      (!Schema.IsFormat(schema) || CheckFormat(current, context, schema, value)) &&
      (!Schema.IsPattern(schema) || CheckPattern(current, context, schema, value))
    )) &&
    (!(G.IsNumber(value) || G.IsBigInt(value)) || (
      (!Schema.IsExclusiveMaximum(schema) || CheckExclusiveMaximum(current, context, schema, value)) &&
      (!Schema.IsExclusiveMinimum(schema) || CheckExclusiveMinimum(current, context, schema, value)) &&
      (!Schema.IsMaximum(schema) || CheckMaximum(current, context, schema, value)) &&
      (!Schema.IsMinimum(schema) || CheckMinimum(current, context, schema, value)) &&
      (!Schema.IsMultipleOf(schema) || CheckMultipleOf(current, context, schema, value))
    )) &&
    (!Schema.IsRef(schema) || CheckRef(current, context, schema, value)) &&
    (!Schema.IsRecursiveRef(schema) || CheckRecursiveRef(current, context, schema, value)) &&
    (!Schema.IsDynamicRef(schema) || CheckDynamicRef(current, context, schema, value)) &&
    (!Schema.IsConst(schema) || CheckConst(current, context, schema, value)) &&
    (!Schema.IsEnum(schema) || CheckEnum(current, context, schema, value)) &&
    (!Schema.IsIf(schema) || CheckIf(current, context, schema, value)) &&
    (!Schema.IsNot(schema) || CheckNot(current, context, schema, value)) &&
    (!Schema.IsAllOf(schema) || CheckAllOf(current, context, schema, value)) &&
    (!Schema.IsAnyOf(schema) || CheckAnyOf(current, context, schema, value)) &&
    (!Schema.IsOneOf(schema) || CheckOneOf(current, context, schema, value)) &&
    (!Schema.IsUnevaluatedItems(schema) || (!G.IsArray(value) || CheckUnevaluatedItems(current, context, schema, value))) &&
    (!Schema.IsUnevaluatedProperties(schema) || (!G.IsObject(value) || CheckUnevaluatedProperties(current, context, schema, value))) &&
    (!Schema.IsRefine(schema) || CheckRefine(current, context, schema, value))
  )
  return result
}
// ----------------------------------------------------------------
// Error
// ----------------------------------------------------------------
export function ErrorSchemaPushStack(stack: Stack.XStack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XSchema, value: unknown): boolean {
  return (context.Push() && ErrorSchema(stack, context, schemaPath, instancePath, schema, value)) && context.Pop()
}
export function ErrorSchema(stack: Stack.XStack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XSchema, value: unknown): boolean {
  // Optimization: We can safely terminate here when the context is at capacity because we are unable to
  // append additional errors. It is worth being mindful that logical keywords such as allOf, anyOf,
  // oneOf pass a new context per operand, so the capacity check applies per context, not across the
  // full set of errors accumulated by the schema as a whole. (review)
  if(context.AtCapacity()) return false
  const current = Stack.NextStack(stack, schema)
  const result = (Schema.IsSchemaBoolean(schema)) ? ErrorSchemaBoolean(current, context, schemaPath, instancePath, schema, value) : (
    !!(
      +(!Schema.IsType(schema) || ErrorType(current, context, schemaPath, instancePath, schema, value)) &
      +(!(G.IsObject(value) && !G.IsArray(value)) || !!(
        +(!Schema.IsRequired(schema) || ErrorRequired(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsAdditionalProperties(schema) || ErrorAdditionalProperties(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsDependencies(schema) || ErrorDependencies(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsDependentRequired(schema) || ErrorDependentRequired(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsDependentSchemas(schema) || ErrorDependentSchemas(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsPatternProperties(schema) || ErrorPatternProperties(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsProperties(schema) || ErrorProperties(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsPropertyNames(schema) || ErrorPropertyNames(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMinProperties(schema) || ErrorMinProperties(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMaxProperties(schema) || ErrorMaxProperties(current, context, schemaPath, instancePath, schema, value))
      )) &
      +(!G.IsArray(value) || !!(
        +(!Schema.IsAdditionalItems(schema) || ErrorAdditionalItems(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsContains(schema) || ErrorContains(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsItems(schema) || ErrorItems(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMaxContains(schema) || ErrorMaxContains(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMaxItems(schema) || ErrorMaxItems(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMinContains(schema) || ErrorMinContains(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMinItems(schema) || ErrorMinItems(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsPrefixItems(schema) || ErrorPrefixItems(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsUniqueItems(schema) || ErrorUniqueItems(current, context, schemaPath, instancePath, schema, value))
      )) &
      +(!G.IsString(value) || !!(
        +(!Schema.IsMaxLength(schema) || ErrorMaxLength(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMinLength(schema) || ErrorMinLength(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsFormat(schema) || ErrorFormat(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsPattern(schema) || ErrorPattern(current, context, schemaPath, instancePath, schema, value))
      )) &
      +(!(G.IsNumber(value) || G.IsBigInt(value)) || !!(
        +(!Schema.IsExclusiveMaximum(schema) || ErrorExclusiveMaximum(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsExclusiveMinimum(schema) || ErrorExclusiveMinimum(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMaximum(schema) || ErrorMaximum(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMinimum(schema) || ErrorMinimum(current, context, schemaPath, instancePath, schema, value)) &
        +(!Schema.IsMultipleOf(schema) || ErrorMultipleOf(current, context, schemaPath, instancePath, schema, value))
      )) &
      +(!Schema.IsRef(schema) || ErrorRef(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsRecursiveRef(schema) || ErrorRecursiveRef(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsDynamicRef(schema) || ErrorDynamicRef(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsConst(schema) || ErrorConst(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsEnum(schema) || ErrorEnum(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsIf(schema) || ErrorIf(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsNot(schema) || ErrorNot(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsAllOf(schema) || ErrorAllOf(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsAnyOf(schema) || ErrorAnyOf(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsOneOf(schema) || ErrorOneOf(current, context, schemaPath, instancePath, schema, value)) &
      +(!Schema.IsUnevaluatedItems(schema) || (!G.IsArray(value) || ErrorUnevaluatedItems(current, context, schemaPath, instancePath, schema, value))) &
      +(!Schema.IsUnevaluatedProperties(schema) || (!G.IsObject(value) || ErrorUnevaluatedProperties(current, context, schemaPath, instancePath, schema, value)))
    ) &&
    (!Schema.IsRefine(schema) || ErrorRefine(current, context, schemaPath, instancePath, schema, value))
  )
  return result
}
