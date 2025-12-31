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

// ------------------------------------------------------------------
// FromTypeNames
// ------------------------------------------------------------------
type XFromTypeNames<TypeNames extends string[], Result extends unknown = never> = (
  TypeNames extends readonly [infer Left extends string, ...infer Right extends string[]]
    ? XFromTypeNames<Right, Result | XFromTypeName<Left>>
    : Result
)
// ------------------------------------------------------------------
// FromTypeName
// ------------------------------------------------------------------
type XFromTypeName<TypeName extends string> = (
  // jsonschema
  TypeName extends 'object' ? object :
  TypeName extends 'array' ? {} :
  TypeName extends 'boolean' ? boolean :
  TypeName extends 'integer' ? number :
  TypeName extends 'number' ? number :
  TypeName extends 'null' ? null :
  TypeName extends 'string' ? string :
  // xschema
  TypeName extends 'bigint' ? bigint :
  TypeName extends 'symbol' ? symbol :
  TypeName extends 'undefined' ? undefined : 
  TypeName extends 'void' ? void :
  // xschema - structural objects
  TypeName extends 'asyncIterator' ? {} :
  TypeName extends 'constructor' ? {} :
  TypeName extends 'function' ? {} :
  TypeName extends 'iterator' ? {} :
  unknown
)
// ------------------------------------------------------------------
// XStaticType
// ------------------------------------------------------------------
export type XStaticType<TypeName extends string[] | string> = (
  TypeName extends string[] ? XFromTypeNames<TypeName> :
  TypeName extends string ? XFromTypeName<TypeName> :
  unknown
)