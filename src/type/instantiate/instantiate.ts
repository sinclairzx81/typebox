/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import type { TSchema } from '../schema/index'
import type { TArgument } from '../argument/index'
import { type TNever, Never } from '../never/index'
import { type TReadonlyOptional, ReadonlyOptional } from '../readonly-optional/index'
import { type TReadonly, Readonly } from '../readonly/index'
import { type TOptional, Optional } from '../optional/index'

import { Remap, type TRemap, type TMapping as TRemapMapping } from '../remap/index'
import * as KindGuard from '../guard/kind'

// ------------------------------------------------------------------
// InstantiateArgument
// ------------------------------------------------------------------
// prettier-ignore
type TInstantiateArgument<Argument extends TArgument, Type extends TSchema,
  IsArgumentReadonly extends number = Argument extends TReadonly<TSchema> ? 1 : 0,
  IsArgumentOptional extends number = Argument extends TOptional<TSchema> ? 1 : 0,
  Result extends TSchema = (
    [IsArgumentReadonly, IsArgumentOptional]  extends [1, 1] ? TReadonlyOptional<Type> :
    [IsArgumentReadonly, IsArgumentOptional]  extends [0, 1] ? TOptional<Type> :
    [IsArgumentReadonly, IsArgumentOptional]  extends [1, 0] ? TReadonly<Type> :
    Type
  ) 
> = Result
// prettier-ignore
function InstantiateArgument<Argument extends TArgument, Type extends TSchema>(argument: Argument, type: Type): TInstantiateArgument<Argument, Type> {
  const isReadonly = KindGuard.IsReadonly(argument)
  const isOptional = KindGuard.IsOptional(argument)
  return (
    isReadonly && isOptional ? ReadonlyOptional(type) :
    isReadonly && !isOptional ? Readonly(type) :
    !isReadonly && isOptional ? Optional(type) :
    type
  ) as never
}
// ------------------------------------------------------------------
// Instantiate
// ------------------------------------------------------------------
// prettier-ignore
interface TInstantiateArguments<Arguments extends TSchema[]> extends TRemapMapping { 
  output: (
    this['input'] extends TArgument<infer Index extends number>
      ? Index extends keyof Arguments 
        ? Arguments[Index] extends TSchema
          ? TInstantiateArgument<this['input'], Arguments[Index]>
          : TNever
        : TNever
      : this['input']
  )
}
/** `[JavaScript]` Instantiates a type with the given parameters */
// prettier-ignore
export type TInstantiate<Type extends TSchema, Arguments extends TSchema[]> = (
  TRemap<Type, TInstantiateArguments<Arguments>>
)
/** `[JavaScript]` Instantiates a type with the given parameters */
// prettier-ignore
export function Instantiate<Type extends TSchema, Arguments extends TSchema[]>(type: Type, args: [...Arguments]): TInstantiate<Type, Arguments> {
  return Remap(type, (type) => {
    return KindGuard.IsArgument(type)
      ? type.index in args
        ? KindGuard.IsSchema(args[type.index])
          ? InstantiateArgument(type, args[type.index]) 
          : Never()
        : Never()
      : type
  }) as never
}
