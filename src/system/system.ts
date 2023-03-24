/*--------------------------------------------------------------------------

@sinclair/typebox/system

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

import * as Types from '../typebox'

export class TypeSystemDuplicateTypeKind extends Error {
  constructor(kind: string) {
    super(`Duplicate type kind '${kind}' detected`)
  }
}
export class TypeSystemDuplicateFormat extends Error {
  constructor(kind: string) {
    super(`Duplicate string format '${kind}' detected`)
  }
}

/** Creates user defined types and formats and provides overrides for value checking behaviours */
export namespace TypeSystem {
  // ------------------------------------------------------------------------
  // Assertion Policies
  // ------------------------------------------------------------------------
  /** Sets whether TypeBox should assert optional properties using the TypeScript `exactOptionalPropertyTypes` assertion policy. The default is `false` */
  export let ExactOptionalPropertyTypes: boolean = false
  /** Sets whether arrays should be treated as a kind of objects. The default is `false` */
  export let AllowArrayObjects: boolean = false
  /** Sets whether `NaN` or `Infinity` should be treated as valid numeric values. The default is `false` */
  export let AllowNaN: boolean = false
  /** Sets whether `null` should validate for void types. The default is `false` */
  export let AllowVoidNull: boolean = false

  // ------------------------------------------------------------------------
  // String Formats and Types
  // ------------------------------------------------------------------------
  /** Creates a new type */
  export function Type<Type, Options = object>(kind: string, check: (options: Options, value: unknown) => boolean) {
    if (Types.TypeRegistry.Has(kind)) throw new TypeSystemDuplicateTypeKind(kind)
    Types.TypeRegistry.Set(kind, check)
    return (options: Partial<Options> = {}) => Types.Type.Unsafe<Type>({ ...options, [Types.Kind]: kind })
  }
  /** Creates a new string format */
  export function Format<F extends string>(format: F, check: (value: string) => boolean): F {
    if (Types.FormatRegistry.Has(format)) throw new TypeSystemDuplicateFormat(format)
    Types.FormatRegistry.Set(format, check)
    return format
  }

  // ------------------------------------------------------------------------
  // Deprecated
  // ------------------------------------------------------------------------
  /** @deprecated Use `TypeSystem.Type()` instead. */
  export function CreateType<Type, Options = object>(kind: string, check: (options: Options, value: unknown) => boolean) {
    return Type<Type, Options>(kind, check)
  }
  /** @deprecated Use `TypeSystem.Format()` instead.  */
  export function CreateFormat<F extends string>(format: F, check: (value: string) => boolean): F {
    return Format<F>(format, check)
  }
}
