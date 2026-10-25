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

import { Arguments } from '../system/index.ts'
import { Guard } from '../guard/index.ts'
import * as ModuleGuard from './guard/index.ts'
import * as Schema from '../schema/index.ts'
import * as Type from '../type/index.ts'
import * as Section from './section/index.ts'
import * as Emit from './emit/index.ts'

// ------------------------------------------------------------------
// NonRepresentable
// ------------------------------------------------------------------
function NonRepresentable(schema: Schema.XSchema): boolean {
  return Type.IsGeneric(schema) || Type.IsDeferred(schema) || Type.IsCall(schema)
}
// ------------------------------------------------------------------
// BuildTypeModule
// ------------------------------------------------------------------
function BuildTypeModule(context: Type.TProperties, module: Type.TModule): string {
  const $defs = Guard.Keys(module).reduce((result, key) => NonRepresentable(module[key]) ? result : { ...result, [key]: module[key] }, {})
  return Emit.Module(context, { $defs }, Section.MetadataIndex)
}
// ------------------------------------------------------------------
// BuildJsonModule
// ------------------------------------------------------------------
function BuildJsonModule(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XDefs): string {
  return Emit.Module(context, schema, Section.MetadataRef)
}
// ------------------------------------------------------------------
// BuildType
// ------------------------------------------------------------------
function BuildType(context: Type.TProperties, schema: Type.TSchema): string {
  const type = NonRepresentable(schema) ? Type.Never() : schema
  return Emit.Type(context, type, Section.MetadataIndex)
}
// ------------------------------------------------------------------
// BuildJson
// ------------------------------------------------------------------
function BuildJson(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema): string {
  return Emit.Type(context, schema, Section.MetadataIndex)
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
/** Builds a standalone validator module for the given Schema, Type or Module */
export function Build(schema: Schema.XSchema): string
/** Builds a standalone validator module for the given Schema, Type or Module */
export function Build(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema): string
/** Builds a standalone validator module for the given Schema, Type or Module */
export function Build(...args: unknown[]): string {
  const [context, schema] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema]>(args, {
    2: (context, schema) => [context, schema],
    1: (schema) => [{}, schema]
  })
  return (
    ModuleGuard.IsTypeModule(schema) ? BuildTypeModule(context, schema) :
    ModuleGuard.IsJsonModule(schema) ? BuildJsonModule(context, schema) :
    ModuleGuard.IsJson(schema) ? BuildJson(context, schema) :
    ModuleGuard.IsType(schema) ? BuildType(context, schema) :
    BuildType(context, Type.Never())
  )
}
