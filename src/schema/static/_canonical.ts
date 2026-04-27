/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2026 Haydn Paterson 

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

// ------------------------------------------------------------------
// CanonicalTuple
// ------------------------------------------------------------------
type XCanonicalTuple<Value extends readonly unknown[]> = (
  Value extends [infer Left, ...infer Right extends unknown[]] 
    ? [XCanonical<Left>, ...XCanonicalTuple<Right>]
    : []
)
// ------------------------------------------------------------------
// CanonicalArray
// ------------------------------------------------------------------
type XCanonicalArray<Value extends unknown, 
  Result extends unknown[] = XCanonical<Value>[]
> = Result
// ------------------------------------------------------------------
// CanonicalObject
// ------------------------------------------------------------------
type XCanonicalObject< Value extends object, Result extends Record<PropertyKey, unknown> = {
  -readonly [Key in keyof Value]: XCanonical<Value[Key]>
}> = Result

// ------------------------------------------------------------------
// Canonical (i.e. Non-Readonly)
// ------------------------------------------------------------------
export type XCanonical<Schema extends unknown> = (
  Schema extends readonly [...infer Schemas extends unknown[]] ? XCanonicalTuple<Schemas> : 
  Schema extends readonly (infer Schema)[] ? XCanonicalArray<Schema> : 
  Schema extends object ? XCanonicalObject<Schema> : 
  Schema
)
