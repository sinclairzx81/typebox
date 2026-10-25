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
import * as Type from '../../type/index.ts'
import { FromType } from './from_type.ts'

// ------------------------------------------------------------------
// Unrepresentable
// ------------------------------------------------------------------
function Unrepresentable(identifier: string): string {
  return `(/* unrepresentable-identifier ${JSON.stringify(identifier)} */ any)`
}
// ------------------------------------------------------------------
// Identifier
// ------------------------------------------------------------------
const IdentifierPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/
function Identifier(identifier: string): string {
  return IdentifierPattern.test(identifier) ? identifier : Unrepresentable(identifier)
}
// ------------------------------------------------------------------
// Continue
// ------------------------------------------------------------------
const maxDepth = 2, depths = new WeakMap<Type.TSchema, number>()
function Continue(context: Type.TProperties, target: Type.TSchema): string {
  const depth = depths.get(target) ?? 0
  if (depth >= maxDepth) return 'any'
  depths.set(target, depth + 1)
  try {
    return FromType(context, target)
  } finally {
    depths.set(target, depth)
  }
}
// ------------------------------------------------------------------
// FromRef
// ------------------------------------------------------------------
export function FromRef(context: Type.TProperties, type: Type.TRef): string {
  // Note: If the target does not exist, just emit an identifier and expect
  // it to resolve elsewhere in the context. TS will report it as unresolved
  // which signals a bad reference (review)
  return Guard.HasPropertyKey(context, type.$ref) 
    ? Continue(context, context[type.$ref]) 
    : Identifier(type.$ref)
}
