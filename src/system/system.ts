/*--------------------------------------------------------------------------

@sinclair/typebox/system

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

import { TypeRegistry, FormatRegistry } from '../type/registry/index'
import { Unsafe, type TUnsafe } from '../type/unsafe/index'
import { Kind } from '../type/symbols/index'
import { TypeBoxError } from '../type/error/index'

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
export class TypeSystemDuplicateTypeKind extends TypeBoxError {
  constructor(kind: string) {
    super(`Duplicate type kind '${kind}' detected`)
  }
}
export class TypeSystemDuplicateFormat extends TypeBoxError {
  constructor(kind: string) {
    super(`Duplicate string format '${kind}' detected`)
  }
}
// ------------------------------------------------------------------
// TypeSystem
// ------------------------------------------------------------------
export type TypeFactoryFunction<Type, Options = Record<PropertyKey, unknown>> = (options?: Partial<Options>) => TUnsafe<Type>

/** Creates user defined types and formats and provides overrides for value checking behaviours */
export namespace TypeSystem {
  /** Creates a new type */
  export function Type<Type, Options = Record<PropertyKey, unknown>>(kind: string, check: (options: Options, value: unknown) => boolean): TypeFactoryFunction<Type, Options> {
    if (TypeRegistry.Has(kind)) throw new TypeSystemDuplicateTypeKind(kind)
    TypeRegistry.Set(kind, check)
    return (options: Partial<Options> = {}) => Unsafe<Type>({ ...options, [Kind]: kind })
  }
  /** Creates a new string format */
  export function Format<F extends string>(format: F, check: (value: string) => boolean): F {
    if (FormatRegistry.Has(format)) throw new TypeSystemDuplicateFormat(format)
    FormatRegistry.Set(format, check)
    return format
  }
}
