/*--------------------------------------------------------------------------

typebox - runtime structural type system for javascript.

The MIT License (MIT)

Copyright (c) 2017 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { reflect }  from "./reflect"
import { check }    from "./check"
import { schema }   from "./schema"
import { infer }    from "./infer"
import { compare }  from "./compare"
import { generate } from "./generate"

import {
  Static,
  TBase,
  TAny,
  TUndefined,
  TNull,
  TLiteralType,
  TLiteral,
  TString,
  TNumber,
  TBoolean,
  TObjectProperties,
  TObject,
  TArray,
  TTuple1,
  TTuple2,
  TTuple3,
  TTuple4,
  TTuple5,
  TTuple6,
  TTuple7,
  TTuple8,
  TUnion1,
  TUnion2,
  TUnion3,
  TUnion4,
  TUnion5,
  TUnion6,
  TUnion7,
  TUnion8,
  Any,
  Undefined,
  Null,
  Literal,
  String,
  Number,
  Boolean,
  Object,
  Array,
  Tuple,
  Union
} from "./spec"

export {
  reflect,
  check,
  schema,
  infer,
  compare,
  generate,

  Static,
  TBase,
  TAny,
  TUndefined,
  TNull,
  TLiteralType,
  TLiteral,
  TString,
  TNumber,
  TBoolean,
  TObjectProperties,
  TObject,
  TArray,
  TTuple1,
  TTuple2,
  TTuple3,
  TTuple4,
  TTuple5,
  TTuple6,
  TTuple7,
  TTuple8,
  TUnion1,
  TUnion2,
  TUnion3,
  TUnion4,
  TUnion5,
  TUnion6,
  TUnion7,
  TUnion8,
  Any,
  Undefined,
  Null,
  Literal,
  String,
  Number,
  Boolean,
  Object,
  Array,
  Tuple,
  Union
}