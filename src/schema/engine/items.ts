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
import { Stack } from './_stack.ts'
import { BuildContext, CheckContext, ErrorContext } from './_context.ts'
import { Guard as G, EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema, CheckSchema, ErrorSchema } from './schema.ts'

// ------------------------------------------------------------------
// ItemsSized
// ------------------------------------------------------------------
function BuildItemsSized(stack: Stack, context: BuildContext, schema: Schema.XItemsSized, value: string): string {
  return E.ReduceAnd(schema.items.map((schema, index) => {
    const isLength = E.IsLessEqualThan(E.Member(value, 'length'), E.Constant(index))
    const isSchema = BuildSchema(stack, context, schema, `${value}[${index}]`)
    const addIndex = context.AddIndex(E.Constant(index))
    const guarded = context.UseUnevaluated() ? E.And(isSchema, addIndex) : isSchema
    return E.Or(isLength, guarded)
  }))
}
function CheckItemsSized(stack: Stack, context: CheckContext, schema: Schema.XItemsSized, value: unknown[]): boolean {
  return G.Every(schema.items, 0, (schema, index) => {
    return G.IsLessEqualThan(value.length, index) 
      || (CheckSchema(stack, context, schema, value[index]) && context.AddIndex(index))
  })
}
function ErrorItemsSized(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XItemsSized, value: unknown[]): boolean {
  return G.EveryAll(schema.items, 0, (schema, index) => {
    const nextSchemaPath = `${schemaPath}/items/${index}`
    const nextInstancePath = `${instancePath}/${index}`
    return G.IsLessEqualThan(value.length, index) 
      || (ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema, value[index]) && context.AddIndex(index))
  })
}
// ------------------------------------------------------------------
// ItemsUnsized
// ------------------------------------------------------------------
function BuildItemsUnsized(stack: Stack, context: BuildContext, schema: Schema.XItemsUnsized, value: string): string {
  const offset = Schema.IsPrefixItems(schema) ? schema.prefixItems.length : 0
  const isSchema = BuildSchema(stack, context, schema.items, 'element')
  const addIndex = context.AddIndex('index')
  const guarded = context.UseUnevaluated() ? E.And(isSchema, addIndex) : isSchema
  return E.Every(value, E.Constant(offset), ['element', 'index'], guarded)
}
function CheckItemsUnsized(stack: Stack, context: CheckContext, schema: Schema.XItemsUnsized, value: unknown[]): boolean {
  const offset = Schema.IsPrefixItems(schema) ? schema.prefixItems.length : 0
  return G.Every(value, offset, (element, index) => {
    return CheckSchema(stack, context, schema.items, element) 
      && context.AddIndex(index)
  })
}
function ErrorItemsUnsized(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XItemsUnsized, value: unknown[]): boolean {
  const offset = Schema.IsPrefixItems(schema) ? schema.prefixItems.length : 0
  return G.EveryAll(value, offset, (element, index) => {
    const nextSchemaPath = `${schemaPath}/items`
    const nextInstancePath = `${instancePath}/${index}`
    return ErrorSchema(stack, context, nextSchemaPath, nextInstancePath, schema.items, element) 
      && context.AddIndex(index)
  })
}
// ------------------------------------------------------------------
// Items
// ------------------------------------------------------------------
export function BuildItems(stack: Stack, context: BuildContext, schema: Schema.XItems, value: string): string {
  return Schema.IsItemsSized(schema) ? BuildItemsSized(stack, context, schema, value) : BuildItemsUnsized(stack, context, schema, value)
}
export function CheckItems(stack: Stack, context: CheckContext, schema: Schema.XItems, value: unknown[]): boolean {
  return Schema.IsItemsSized(schema) ? CheckItemsSized(stack, context, schema, value) : CheckItemsUnsized(stack, context, schema, value)
}
export function ErrorItems(stack: Stack, context: ErrorContext, schemaPath: string, instancePath: string, schema: Schema.XItems, value: unknown[]): boolean {
  return Schema.IsItemsSized(schema) ? ErrorItemsSized(stack, context, schemaPath, instancePath, schema, value) : ErrorItemsUnsized(stack, context, schemaPath, instancePath, schema, value)
}