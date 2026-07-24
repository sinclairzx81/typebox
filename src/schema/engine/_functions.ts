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
import { BuildContext } from './_context.ts'
import { EmitGuard as E } from '../../guard/index.ts'
import { BuildSchema } from './schema.ts'

// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
type Href = string & { kind: 'Href' }
type Name = string & { kind: 'Name' }

const index = [0]
const names = new Map<Schema.XSchema, Map<Href, Name>>
const funcs = new Map<Name, string> ()

// ------------------------------------------------------------------
// CreateName
// ------------------------------------------------------------------
function NextName(): Name {
  return `${index[0]++}` as Name
}
function CreateName(schema: Schema.XSchema, href: Href): Name {
  if(!names.has(schema)) names.set(schema, new Map<Href, Name>())
  const hrefs = names.get(schema)!
  if(hrefs.has(href)) return hrefs.get(href)!
  const name = NextName()
  hrefs.set(href, name)
  return name
}
// ------------------------------------------------------------------
// CreateCallExpression
// ------------------------------------------------------------------
function CreateCallExpression(context: BuildContext, _schema: Schema.XSchema, name: string, value: string): string {
  return context.UseUnevaluated()
    ? E.Call(`check_${name}`, ['context', value])
    : E.Call(`check_${name}`, [value])
}
// ------------------------------------------------------------------
// CreateFunctionExpression
// ------------------------------------------------------------------
function CreateFunctionExpression(stack: Stack, context: BuildContext, schema: Schema.XSchema, name: string): string {
  const expression = BuildSchema(stack, context, schema, 'value')
  return context.UseUnevaluated()
    ? E.ConstDeclaration(`check_${name}`, E.ArrowFunction(['context', 'value'], expression))
    : E.ConstDeclaration(`check_${name}`, E.ArrowFunction(['value'], expression))
}
// ------------------------------------------------------------------
// ResetFunctions
// ------------------------------------------------------------------
export function ResetFunctions(): void {
  index[0] = 0
  names.clear()
  funcs.clear()
}
// ------------------------------------------------------------------
// GetFunctions
// ------------------------------------------------------------------
export function GetFunctions(): string[] {
  return [...funcs.values()]
}
// ------------------------------------------------------------------
// CreateFunction
// ------------------------------------------------------------------
export function CreateFunction(stack: Stack, context: BuildContext, schema: Schema.XSchema, value: string): string {
  const name = CreateName(schema, stack.BaseURL().href as Href)
  const call = CreateCallExpression(context, schema, name, value)
  if (funcs.has(name)) return call
  funcs.set(name, '')
  funcs.set(name, CreateFunctionExpression(stack, context, schema, name))
  return call
}
