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

import { Kind, Hint, ReadonlyKind, OptionalKind } from '../symbols/index'

export interface SchemaOptions {
  $schema?: string
  /** Id for this schema */
  $id?: string
  /** Title of this schema */
  title?: string
  /** Description of this schema */
  description?: string
  /** Default value for this schema */
  default?: any
  /** Example values matching this schema */
  examples?: any
  /** Optional annotation for readOnly */
  readOnly?: boolean
  /** Optional annotation for writeOnly */
  writeOnly?: boolean
  [prop: string]: any
}
export interface TKind {
  [Kind]: string
}
export interface TSchema extends TKind, SchemaOptions {
  [ReadonlyKind]?: string
  [OptionalKind]?: string
  [Hint]?: string
  params: unknown[]
  static: unknown
}
