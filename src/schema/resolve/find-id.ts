/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

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

import { Guard } from '../../guard/index.ts'
import * as Schema from '../types/index.ts'
import { Enumerate } from './enumerate.ts'

export function FindIdExact(schema: Schema.XSchema, id: string): Schema.XSchema | undefined {
  for (const qualified of Enumerate(schema)) {
    if (Schema.IsId(qualified.schema) && Guard.IsEqual(qualified.schema.$id, id)) {
      return qualified.schema
    }
  }
  return undefined
}
export function FindIdQualified(schema: Schema.XSchema, id: string, base: URL): Schema.XSchema | undefined {
  const absoluteRef = new URL(id, base)
  for (const qualified of Enumerate(schema)) {
    if (Schema.IsId(qualified.schema) && Guard.IsEqual(absoluteRef.pathname, qualified.url.pathname)) {
      return qualified.schema
    }
  }
  return undefined
}
