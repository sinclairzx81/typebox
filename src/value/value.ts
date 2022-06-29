/*--------------------------------------------------------------------------

@sinclair/typebox

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

import * as Types from '../typebox'
import { CreateValue } from './create'
import { CheckValue } from './check'
import { CloneValue } from './clone'
import { DeltaValue, Edit } from './delta'
import { UpcastValue } from './upcast'

export { Edit, EditType } from './delta'

export namespace Value {
  /** Returns true if the value conforms to the given schema */
  export function Check<T extends Types.TSchema>(schema: T, value: any): value is Types.Static<T> {
    return CheckValue.Check(schema, value)
  }

  /** Returns a deep clone of the given value */
  export function Clone<T>(value: T): T {
    return CloneValue.Create(value)
  }

  /** Creates a value from the given schema type */
  export function Create<T extends Types.TSchema>(schema: T): Types.Static<T> {
    return CreateValue.Create(schema)
  }

  /** Diffs the value and produces edits to transform the value into the next value */
  export function Diff(value: any, next: any): Edit[] {
    return DeltaValue.Diff(value, next)
  }

  /** Patches a value by applying a series of edits */
  export function Patch(value: any, edits: Edit[]): any {
    return DeltaValue.Edit(value, edits)
  }

  /** Upcasts a value to match a schema while preserving as much information from the original value as possible. */
  export function Upcast<T extends Types.TSchema>(schema: T, value: any): Types.Static<T> {
    return UpcastValue.Create(schema, value)
  }
}
