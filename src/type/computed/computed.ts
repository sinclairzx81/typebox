/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import type { TSchema, SchemaOptions } from '../schema/index'
import { CreateType } from '../create/index'
import { Kind } from '../symbols/symbols'

// ------------------------------------------------------------------
// Computed
// ------------------------------------------------------------------
export interface TComputed<Target extends string = string, Parameters extends TSchema[] = []> extends TSchema {
  [Kind]: 'Computed'
  target: Target
  parameters: Parameters
}
/** `[Internal]` Creates a deferred computed type. This type is used exclusively in modules to defer resolution of computable types that contain interior references  */
export function Computed<Target extends string, Parameters extends TSchema[]>(target: Target, parameters: [...Parameters], options?: SchemaOptions): TComputed<Target, Parameters> {
  return CreateType({ [Kind]: 'Computed', target, parameters }, options) as never
}
