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

import Type from 'typebox'

// ------------------------------------------------------------------
// ThenFunction<T>
// ------------------------------------------------------------------
type TThenFunction<Type extends Type.TSchema> = (
  Type.TFunction<[
    Type.TFunction<[Type], Type.TUnknown>
  ], Type.TUnknown>
)
function ThenFunction<Type extends Type.TSchema>(type: Type): TThenFunction<Type> {
  return Type.Function([
    Type.Function([type], Type.Unknown())
  ], Type.Unknown())
}
// ------------------------------------------------------------------
// CatchFunction
// ------------------------------------------------------------------
type TCatchFunction = (
  Type.TFunction<[
    Type.TFunction<[Type.TObject<{}>], Type.TUnknown>
  ], Type.TUnknown>
)
function CatchFunction(): TCatchFunction {
  return Type.Function([
    Type.Function([Type.Object({})], Type.Unknown())
  ], Type.Unknown())
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
export type TPromise<Type extends Type.TSchema> = (
  Type.TUnsafe<Promise<Type.Static<Type>>, Type.TObject<{
    then: TThenFunction<Type>,
    catch: TCatchFunction
  }>>
)
export function Promise<Type extends Type.TSchema>(type: Type): TPromise<Type> {
  return Type.Unsafe({} as unknown, Type.Object({
    then: ThenFunction(type),
    catch: CatchFunction()
  })) as never
}