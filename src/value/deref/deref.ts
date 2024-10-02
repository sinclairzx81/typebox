/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TSchema } from '../../type/schema/index'
import type { TRef } from '../../type/ref/index'
import type { TThis } from '../../type/recursive/index'
import { TypeBoxError } from '../../type/error/index'
import { Kind } from '../../type/symbols/index'
import { IsString } from '../guard/guard'
export class TypeDereferenceError extends TypeBoxError {
  constructor(public readonly schema: TRef | TThis) {
    super(`Unable to dereference schema with $id '${schema.$ref}'`)
  }
}
function Resolve(schema: TThis | TRef, references: TSchema[]): TSchema {
  const target = references.find((target) => target.$id === schema.$ref)
  if (target === undefined) throw new TypeDereferenceError(schema)
  return Deref(target, references)
}

/** `[Internal]` Pushes a schema onto references if the schema has an $id and does not exist on references */
export function Pushref(schema: TSchema, references: TSchema[]): TSchema[] {
  if (!IsString(schema.$id) || references.some((target) => target.$id === schema.$id)) return references
  references.push(schema)
  return references
}

/** `[Internal]` Dereferences a schema from the references array or throws if not found */
export function Deref(schema: TSchema, references: TSchema[]): TSchema {
  // prettier-ignore
  return (schema[Kind] === 'This' || schema[Kind] === 'Ref') 
    ? Resolve(schema as never, references)
    : schema
}
