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

// deno-fmt-ignore-file

import * as T from '../../type/index.ts'

// ------------------------------------------------------------------
// Insert
// ------------------------------------------------------------------
export type TInsert = T.Static<typeof Insert>
export const Insert: T.TObject<{
  type: T.TLiteral<'insert'>
  path: T.TString
  value: T.TUnknown
}> = T.Object({
  type: T.Literal('insert'),
  path: T.String(),
  value: T.Unknown(),
})
// ------------------------------------------------------------------
// Update
// ------------------------------------------------------------------
export type TUpdate = T.Static<typeof Update>
export const Update: T.TObject<{
  type: T.TLiteral<'update'>
  path: T.TString
  value: T.TUnknown
}> = Object({
  type: T.Literal('update'),
  path: T.String(),
  value: T.Unknown(),
})
// ------------------------------------------------------------------
// Delete
// ------------------------------------------------------------------
export type TDelete = T.Static<typeof Delete>
export const Delete: T.TObject<{
  type: T.TLiteral<'delete'>
  path: T.TString
}> = T.Object({
  type: T.Literal('delete'),
  path: T.String(),
})
// ------------------------------------------------------------------
// Edit
// ------------------------------------------------------------------
export type TEdit = T.Static<typeof Edit>
export const Edit: T.TUnion<[
  typeof Insert, 
  typeof Update, 
  typeof Delete
]> = T.Union([Insert, Update, Delete])

