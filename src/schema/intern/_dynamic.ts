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

import { Guard } from '../../guard/index.ts'
import * as Schema from '../types/index.ts'
import * as Stack from '../engine/_stack.ts'
import * as Resolve from '../resolve/resolve.ts'
import * as Key from './_key.ts'

type XRemotes = Record<PropertyKey, Schema.XSchema>
type XRegistry = Map<string, Schema.XSchema>

// ------------------------------------------------------------------
// IsDynamicResource
// ------------------------------------------------------------------
function IsDynamicAnchorRef(stack: Stack.XStack, schema: Schema.XSchemaObject): boolean {
  if (!Schema.IsDynamicRef(schema)) return false
  const target = Resolve.DynamicRef(stack, schema)
  return Schema.IsSchemaObject(target) && Schema.IsDynamicAnchor(target)
}
function IsRecursiveAnchorRef(stack: Stack.XStack, schema: Schema.XSchemaObject): boolean {
  if (!Schema.IsRecursiveRef(schema)) return false
  const target = Resolve.RecursiveRef(stack, schema)
  return Schema.IsSchemaObject(target) && Schema.IsRecursiveAnchorTrue(target)
}
function HasDynamicResourceFromArray(stack: Stack.XStack, value: unknown[]): boolean {
  return value.some((inner) => HasDynamicResourceValue(stack, inner))
}
function HasDynamicResourceFromObject(stack: Stack.XStack, schema: Schema.XSchemaObject): boolean {
  const next = Stack.NextStack(stack, schema)
  return (
    IsDynamicAnchorRef(stack, schema) || 
    IsRecursiveAnchorRef(stack, schema) || 
    Guard.Keys(schema as never).some((key) => HasDynamicResourceValue(next, schema[key as never]))
  )
}
function HasDynamicResourceValue(stack: Stack.XStack, value: unknown): boolean {
  return (
    Guard.IsArray(value) ? HasDynamicResourceFromArray(stack, value) :
    Schema.IsSchemaObject(value) ? HasDynamicResourceFromObject(stack, value) :
    false
  )
}
export function IsDynamicResource(registry: XRegistry, remotes: XRemotes, stack: Stack.XStack, schema: Schema.XSchemaObject): boolean {
  const reusableRoot = Schema.IsRef(schema) && Key.IsDefsRef(schema.$ref) && registry.has(Key.DefsKey(schema.$ref))
  return !reusableRoot && Guard.Keys(remotes).length > 0 && HasDynamicResourceValue(stack, schema)
}
// ------------------------------------------------------------------
// DynamicResource
// ------------------------------------------------------------------
function ResourcesFromArray(remotes: XRemotes, stack: Stack.XStack, value: unknown[]): XRemotes {
  return value.reduce<XRemotes>((result, inner) => Resources(remotes, stack, inner, result), {})
}
function ResourcesFromObject(remotes: XRemotes, stack: Stack.XStack, schema: Schema.XSchemaObject): XRemotes {
  const next = Stack.NextStack(stack, schema)
  return Guard.Keys(schema as never).reduce((result, key) => Resources(remotes, next, schema[key as never], result), {})
}
function Resources(remotes: XRemotes, stack: Stack.XStack, value: unknown, result: XRemotes): XRemotes {
  return (
    Guard.IsArray(value) ? ResourcesFromArray(remotes, stack, value) :
    Schema.IsSchemaObject(value) ? ResourcesFromObject(remotes, stack, value) :
    result
  )
}
export function DynamicResource(remotes: XRemotes, stack: Stack.XStack, schema: Schema.XSchemaObject): Schema.XSchemaObject {
  const defs = Schema.IsDefs(schema) ? schema.$defs : {}
  const resources = Resources(remotes, stack, schema, {})
  return { ...schema, $defs: { ...resources, ...defs } }
}
