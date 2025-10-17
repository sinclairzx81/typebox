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
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'

// ------------------------------------------------------------------
// TypeName
// ------------------------------------------------------------------
function BuildTypeName(context: BuildContext, type: string, value: string): string {
  return (
    // jsonschema
    G.IsEqual(type, 'object') ? E.IsObjectNotArray(value) :
    G.IsEqual(type, 'array') ? E.IsArray(value) :
    G.IsEqual(type, 'boolean') ? E.IsBoolean(value) :
    G.IsEqual(type, 'integer') ? E.IsInteger(value) :
    G.IsEqual(type, 'number') ? E.IsNumber(value) :
    G.IsEqual(type, 'null') ? E.IsNull(value) :
    G.IsEqual(type, 'string') ? E.IsString(value) :
    // xschema
    G.IsEqual(type, 'asyncIterator') ? E.IsAsyncIterator(value) : 
    G.IsEqual(type, 'bigint') ? E.IsBigInt(value) :
    G.IsEqual(type, 'constructor') ? E.IsConstructor(value) :
    G.IsEqual(type, 'function') ? E.IsFunction(value) :
    G.IsEqual(type, 'iterator') ? E.IsIterator(value) :
    G.IsEqual(type, 'symbol') ? E.IsSymbol(value) :
    G.IsEqual(type, 'undefined') ? E.IsUndefined(value) :
    G.IsEqual(type, 'void') ? E.IsUndefined(value) :
    E.Constant(true)
  )
}
function CheckTypeName(context: CheckContext, type: string, schema: S.XSchemaObject, value: unknown): boolean {
  return (
    // jsonschema
    G.IsEqual(type, 'object') ? G.IsObjectNotArray(value) :
    G.IsEqual(type, 'array') ? G.IsArray(value) :
    G.IsEqual(type, 'boolean') ? G.IsBoolean(value) :
    G.IsEqual(type, 'integer') ? G.IsInteger(value) :
    G.IsEqual(type, 'number') ? G.IsNumber(value) :
    G.IsEqual(type, 'null') ? G.IsNull(value) :
    G.IsEqual(type, 'string') ? G.IsString(value) :
    // xschema
    G.IsEqual(type, 'asyncIterator') ? G.IsAsyncIterator(value) :
    G.IsEqual(type, 'bigint') ? G.IsBigInt(value) :
    G.IsEqual(type, 'constructor') ? G.IsConstructor(value) :
    G.IsEqual(type, 'function') ? G.IsFunction(value) :
    G.IsEqual(type, 'iterator') ? G.IsIterator(value) :
    G.IsEqual(type, 'symbol') ? G.IsSymbol(value) :
    G.IsEqual(type, 'undefined') ? G.IsUndefined(value) :
    G.IsEqual(type, 'void') ? G.IsUndefined(value) :
    true
  )
}
// ------------------------------------------------------------------
// TypeNames
// ------------------------------------------------------------------
function BuildTypeNames(context: BuildContext, typenames: string[], value: string): string {
  return E.ReduceOr(typenames.map(type => BuildTypeName(context, type, value)))
}
function CheckTypeNames(context: CheckContext, types: string[], schema: S.XSchemaObject, value: unknown): boolean {
  return types.some(type => CheckTypeName(context, type, schema, value))
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export function BuildType(context: BuildContext, schema: S.XType, value: string): string {
  return G.IsArray(schema.type) ? BuildTypeNames(context, schema.type, value) : BuildTypeName(context, schema.type, value)
}
export function CheckType(context: CheckContext, schema: S.XType, value: unknown): boolean {
  return G.IsArray(schema.type) ? CheckTypeNames(context, schema.type, schema, value) : CheckTypeName(context, schema.type, schema, value)
}
export function ErrorType(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XType, value: unknown): boolean {
  const isType = G.IsArray(schema.type) ? CheckTypeNames(context, schema.type, schema, value) : CheckTypeName(context, schema.type, schema, value)
  return isType || context.AddError({
    keyword: 'type',
    schemaPath,
    instancePath,
    params: { type: schema.type }
  })
}