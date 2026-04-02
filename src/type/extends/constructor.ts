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

import { type TSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TAny, IsAny } from '../types/any.ts'
import { type TConstructor, IsConstructor } from '../types/constructor.ts'
import { type TUnknown, IsUnknown } from '../types/unknown.ts'
import * as Result from './result.ts'

// ------------------------------------------------------------------
// Parameters | ReturnType
// ------------------------------------------------------------------ 
import { type TExtendsParameters, ExtendsParameters } from './parameters.ts'
import { type TExtendsReturnType, ExtendsReturnType } from './return-type.ts'

// ------------------------------------------------------------------
// ExtendsConstructor
// ------------------------------------------------------------------ 
export type TExtendsConstructor<Inferred extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema, Right extends TSchema> = (  
  Right extends TAny ? Result.TExtendsTrue<Inferred> :
  Right extends TUnknown ? Result.TExtendsTrue<Inferred> :
  Right extends TConstructor
    ? TExtendsParameters<Inferred, Parameters, Right['parameters']> extends Result.TExtendsTrueLike<infer Inferred extends TProperties>
      ? TExtendsReturnType<Inferred, InstanceType, Right['instanceType']>
      : Result.TExtendsFalse // 'not-a-parameter-match'
    : Result.TExtendsFalse // 'not-a-constructor'
)
export function ExtendsConstructor<Inferred extends TProperties, Parameters extends TSchema[], InstanceType extends TSchema, Right extends TSchema>
  (inferred: Inferred, parameters: [...Parameters], returnType: InstanceType, right: Right): 
    TExtendsConstructor<Inferred, Parameters, InstanceType, Right> {
  return (
    IsAny(right) ? Result.ExtendsTrue(inferred) :
    IsUnknown(right) ? Result.ExtendsTrue(inferred) :
    IsConstructor(right) ? Result.Match(ExtendsParameters(inferred, parameters, right['parameters']), 
      inferred => ExtendsReturnType(inferred, returnType, right['instanceType']), 
      () => Result.ExtendsFalse()) // 'not-a-parameter-match'
    : Result.ExtendsFalse() // 'not-a-constructor'
  ) as never
}
