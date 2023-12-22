/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

export class TypeDereferenceError extends TypeBoxError {
  constructor(public readonly schema: TRef | TThis) {
    super(`Unable to dereference schema with $id '${schema.$id}'`)
  }
}
/** Dereferences a schema from the references array or throws if not found */
export function Deref(schema: TRef | TThis, references: TSchema[]): TSchema {
  const index = references.findIndex((target) => target.$id === schema.$ref)
  if (index === -1) throw new TypeDereferenceError(schema)
  return references[index]
}
