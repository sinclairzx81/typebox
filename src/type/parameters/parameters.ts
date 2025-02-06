/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TSchema, SchemaOptions } from '../schema/index'
import type { TFunction } from '../function/index'
import { Tuple, type TTuple } from '../tuple/index'
import { Never, type TNever } from '../never/index'
import * as KindGuard from '../guard/kind'

// ------------------------------------------------------------------
// Parameters
// ------------------------------------------------------------------
// prettier-ignore
export type TParameters<Type extends TSchema> = (
  Type extends TFunction<infer Parameters extends TSchema[], infer _ReturnType extends TSchema>
    ? TTuple<Parameters>
    : TNever
)
/** `[JavaScript]` Extracts the Parameters from the given Function type */
export function Parameters<Type extends TSchema>(schema: Type, options?: SchemaOptions): TParameters<Type> {
  return (KindGuard.IsFunction(schema) ? Tuple(schema.parameters, options) : Never()) as never
}
