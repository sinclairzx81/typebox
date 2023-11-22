/*--------------------------------------------------------------------------

@sinclair/typebox/type

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

import type { TSchema } from '../schema/index'
import type { TProperties } from '../object/index'
import { Kind } from '../symbols/index'

// ------------------------------------------------------------------
// A TMappedResult is a unevaluated result type returned by various
// types such as Pick, Omit, Index and Extends. This type is kind of
// object that contains properties for each key of TMappedKey. The
// TMapped inference resolver intercepts this type, and selects the
// current key as derived from the TMappedIndex.
//
// This type is considered 'private' and should only be instanced
// by exterior types that support evaluated type mapping.
// ------------------------------------------------------------------
// prettier-ignore
export interface TMappedResult<T extends TProperties = TProperties> extends TSchema {
  [Kind]: 'MappedResult'
  properties: T
  static: unknown
}
// prettier-ignore
export function MappedResult<T extends TProperties>(properties: T): TMappedResult<T> {
  return {
    [Kind]: 'MappedResult',
    properties
  } as unknown as TMappedResult<T>
}
