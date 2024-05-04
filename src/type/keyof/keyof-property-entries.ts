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

import { IndexFromPropertyKeys } from '../indexed/indexed'
import { KeyOfPropertyKeys } from './keyof-property-keys'
import { TSchema } from '../schema/index'

/**
 * `[Utility]` Resolves an array of keys and schemas from the given schema. This method is faster
 * than obtaining the keys and resolving each individually via indexing. This method was written
 * accellerate Intersect and Union encoding.
 */
export function KeyOfPropertyEntries(schema: TSchema): [key: string, schema: TSchema][] {
  const keys = KeyOfPropertyKeys(schema) as string[]
  const schemas = IndexFromPropertyKeys(schema, keys)
  return keys.map((_, index) => [keys[index], schemas[index]])
}
