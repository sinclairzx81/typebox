/*--------------------------------------------------------------------------

@sinclair/typebox/system

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Kind, Type } from '@sinclair/typebox'
import { Custom } from '../custom/index'
import { Format } from '../format/index'

export class TypeSystemDuplicateTypeKind extends Error {
  constructor(kind: string) {
    super(`Duplicate kind '${kind}' detected`)
  }
}
export class TypeSystemDuplicateFormat extends Error {
  constructor(kind: string) {
    super(`Duplicate format '${kind}' detected`)
  }
}

export namespace TypeSystem {
  /** Sets whether arrays should be treated as kinds of objects. The default is `false` */
  export let AllowArrayObjects: boolean = false
  /** Sets whether numeric checks should consider NaN a valid number type. The default is `false` */
  export let AllowNaN: boolean = false
  /** Creates a custom Type */
  export function CreateType<Type, Options = object>(kind: string, callback: (options: Options, value: unknown) => boolean) {
    if (Custom.Has(kind)) throw new TypeSystemDuplicateTypeKind(kind)
    Custom.Set(kind, callback)
    return (options: Partial<Options> = {}) => {
      return Type.Unsafe<Type>({ ...options, [Kind]: kind })
    }
  }
  /** Creates a custom string format */
  export function CreateFormat<Type, Options = object>(format: string, callback: (value: string) => boolean) {
    if (Format.Has(format)) throw new TypeSystemDuplicateFormat(format)
    Format.Set(format, callback)
    return callback
  }
}
