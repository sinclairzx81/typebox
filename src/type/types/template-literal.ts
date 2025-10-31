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
// deno-lint-ignore-file

import { Guard } from '../../guard/index.ts'
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TDeferred, Deferred } from './deferred.ts'

import { type TParseTemplateIntoTypes, ParseTemplateIntoTypes } from '../engine/patterns/template.ts'
import { type TInstantiate, Instantiate } from '../engine/instantiate.ts'
import { type TTemplateLiteralStatic } from '../engine/template-literal/static.ts'
import { Memory } from '../../system/system.ts'

// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticTemplateLiteral<Pattern extends string> = (
  TTemplateLiteralStatic<Pattern>
)
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a TemplateLiteral type. */
export interface TTemplateLiteral<Pattern extends string = string> extends TSchema {
  '~kind': 'TemplateLiteral'
  type: 'string'
  pattern: Pattern
}
// -------------------------------------------------------------------
// Deferred
// -------------------------------------------------------------------
/** Creates a deferred TemplateLiteral action. */
export type TTemplateLiteralDeferred<Types extends TSchema[]> = (
  TDeferred<'TemplateLiteral', [Types]>
)
/** Creates a deferred TemplateLiteral action. */
export function TemplateLiteralDeferred<Types extends TSchema[]>(types: [...Types], options: TSchemaOptions = {}): TTemplateLiteralDeferred<Types> {
  return Deferred('TemplateLiteral', [types], options)
}
// ------------------------------------------------------------------
// TemplateLiteralFromTypes
// ------------------------------------------------------------------
export type TTemplateLiteralFromTypes<Types extends TSchema[],
  Result extends TSchema = TInstantiate<{}, TTemplateLiteralDeferred<Types>>
> = Result
export function TemplateLiteralFromTypes<Types extends TSchema[]>(types: [...Types]): TTemplateLiteralFromTypes<Types> {
  return Instantiate({}, TemplateLiteralDeferred(types, {}))
}
// ------------------------------------------------------------------
// TemplateLiteralFromString
// ------------------------------------------------------------------
export type TTemplateLiteralFromString<Template extends string,
  Types extends TSchema[] = TParseTemplateIntoTypes<Template>,
  Result extends TSchema = TTemplateLiteralFromTypes<Types>
> = Result
export function TemplateLiteralFromString<Template extends string>(template: Template): TTemplateLiteralFromString<Template> {
  const types = ParseTemplateIntoTypes(template) 
  return TemplateLiteralFromTypes(types) as never
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a TemplateLiteral type. */
export function TemplateLiteral<Template extends string>(template: Template, options?: TSchemaOptions): TTemplateLiteralFromString<Template>
/** Creates a TemplateLiteral type. */
export function TemplateLiteral<Types extends TSchema[]>(types: [...Types], options?: TSchemaOptions): TTemplateLiteralFromTypes<Types>
/** Creates a TemplateLiteral type. */
export function TemplateLiteral(input: TSchema[] | string, options: TSchemaOptions = {}): never {
  const type = Guard.IsString(input) ? TemplateLiteralFromString(input) : TemplateLiteralFromTypes(input)
  return Memory.Update(type, {}, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is TTemplateLiteral. */
export function IsTemplateLiteral(value: unknown): value is TTemplateLiteral {
  return IsKind(value, 'TemplateLiteral')
}