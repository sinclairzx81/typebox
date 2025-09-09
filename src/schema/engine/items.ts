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
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// ItemsSized
// ------------------------------------------------------------------
function BuildItemsSized(context: BuildContext, schema: S.XItemsSized, value: string): string {
  return E.ReduceAnd(schema.items.map((schema, index) => {
    const isLength = E.IsGreaterEqualThan(E.Constant(index), E.Member(value, 'length'))
    const isSchema = BuildSchema(context, schema, `${value}[${index}]`)
    const addIndex = context.AddIndex(E.Constant(index))
    const guarded = context.UseUnevaluated() ? E.And(isSchema, addIndex) : isSchema
    return E.Or(isLength, guarded)
  }))
}
function CheckItemsSized(context: CheckContext, schema: S.XItemsSized, value: unknown[]): boolean {
  return G.Every(schema.items, (schema, index) => {
    return G.IsGreaterEqualThan(index, value.length) 
      || (CheckSchema(context, schema, value[index]) && context.AddIndex(index))
  })
}
function ErrorItemsSized(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XItemsSized, value: unknown[]): boolean {
  return G.EveryAll(schema.items, (schema, index) => {
    const nextSchemaPath = `${schemaPath}/items/${index}`
    const nextInstancePath = `${instancePath}/${index}`
    return G.IsGreaterEqualThan(index, value.length) 
      || (ErrorSchema(context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index))
  })
}
// ------------------------------------------------------------------
// ItemsUnsized
// ------------------------------------------------------------------
function BuildItemsUnsized(context: BuildContext, schema: S.XItemsUnsized, value: string): string {
  const isSchema = BuildSchema(context, schema.items, 'element')
  const addIndex = context.AddIndex('index')
  const guarded = context.UseUnevaluated() ? E.And(isSchema, addIndex) : isSchema
  return E.Call(E.Member(value, 'every'), [E.ArrowFunction(['element', 'index'], guarded)])
}
function CheckItemsUnsized(context: CheckContext, schema: S.XItemsUnsized, value: unknown[]): boolean {
  return G.Every(value, (element, index) => {
    return CheckSchema(context, schema.items, element) 
      && context.AddIndex(index)
  })
}
function ErrorItemsUnsized(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XItemsUnsized, value: unknown[]): boolean {
  return G.EveryAll(value, (element, index) => {
    const nextSchemaPath = `${schemaPath}/items`
    const nextInstancePath = `${instancePath}/${index}`
    return ErrorSchema(context, nextSchemaPath, nextInstancePath, schema.items, element) 
      && context.AddIndex(index)
  })
}
// ------------------------------------------------------------------
// Items
// ------------------------------------------------------------------
export function BuildItems(context: BuildContext, schema: S.XItems, value: string): string {
  return S.IsItemsSized(schema) ? BuildItemsSized(context, schema, value) : BuildItemsUnsized(context, schema, value)
}
export function CheckItems(context: CheckContext, schema: S.XItems, value: unknown[]): boolean {
  return S.IsItemsSized(schema) ? CheckItemsSized(context, schema, value) : CheckItemsUnsized(context, schema, value)
}
export function ErrorItems(context: ErrorContext, schemaPath: string, instancePath: string, schema: S.XItems, value: unknown[]): boolean {
  return S.IsItemsSized(schema) ? ErrorItemsSized(context, schemaPath, instancePath, schema, value) : ErrorItemsUnsized(context, schemaPath, instancePath, schema, value)
}