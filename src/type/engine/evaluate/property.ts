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

import { type TSchema } from '../../types/schema.ts'
import { type TOptional, IsOptional } from '../../types/_optional.ts'
import { type TReadonly, IsReadonly } from '../../types/_readonly.ts'
import { type TAddOptionalAction, AddOptionalAction } from '../optional/instantiate_add.ts'
import { type TAddReadonlyAction, AddReadonlyAction } from '../readonly/instantiate_add.ts'
import { type TRemoveOptionalAction, RemoveOptionalAction } from '../optional/instantiate_remove.ts'
import { type TRemoveReadonlyAction, RemoveReadonlyAction } from '../readonly/instantiate_remove.ts'
import { type TEvaluateIntersect, EvaluateIntersect, type TEvaluateUnion, EvaluateUnion } from './evaluate.ts'

// ------------------------------------------------------------------
// EvaluatePropertyIntersect
//
// Evaluates Left and Right as an intersection. It retains Optional 
// and Readonly only when both operands have them.
// ------------------------------------------------------------------
export type TEvaluatePropertyIntersect<Left extends TSchema, Right extends TSchema,
  IsReadonly extends boolean = Left extends TReadonly ? Right extends TReadonly ? true : false : false,
  IsOptional extends boolean = Left extends TOptional ? Right extends TOptional ? true : false : false,
  Evaluated extends TSchema = TEvaluateIntersect<[Left, Right]>,
  Property extends TSchema = TRemoveReadonlyAction<TRemoveOptionalAction<Evaluated>>
> = (
  [IsReadonly, IsOptional] extends [true, true] ? TAddReadonlyAction<TAddOptionalAction<Property>> :
  [IsReadonly, IsOptional] extends [true, false] ? TAddReadonlyAction<Property> :
  [IsReadonly, IsOptional] extends [false, true] ? TAddOptionalAction<Property> :
  Property
)
export function EvaluatePropertyIntersect<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TEvaluatePropertyIntersect<Left, Right> {
  const isReadonly = IsReadonly(left) && IsReadonly(right)
  const isOptional = IsOptional(left) && IsOptional(right)
  const evaluated = EvaluateIntersect([left, right]) as TSchema
  const property = RemoveReadonlyAction(RemoveOptionalAction(evaluated, {}), {})
  return (
    isReadonly && isOptional ? AddReadonlyAction(AddOptionalAction(property, {}), {}) :
    isReadonly ? AddReadonlyAction(property, {}) :
    isOptional ? AddOptionalAction(property, {}) :
    property
  ) as never
}
// ------------------------------------------------------------------
// EvaluatePropertyUnion
//
// Evaluates Left and Right as a union after stripping modifiers.
// It reapplies Optional and Readonly if either operand has them.
// ------------------------------------------------------------------
export type TEvaluatePropertyUnion<Left extends TSchema, Right extends TSchema,
  IsReadonly extends boolean = Left extends TReadonly ? true : Right extends TReadonly ? true : false,
  IsOptional extends boolean = Left extends TOptional ? true : Right extends TOptional ? true : false,
  LeftProperty extends TSchema = TRemoveReadonlyAction<TRemoveOptionalAction<Left>>,
  RightProperty extends TSchema = TRemoveReadonlyAction<TRemoveOptionalAction<Right>>,
  Property extends TSchema = TEvaluateUnion<[LeftProperty, RightProperty]>
> = (
  [IsReadonly, IsOptional] extends [true, true] ? TAddReadonlyAction<TAddOptionalAction<Property>> :
  [IsReadonly, IsOptional] extends [true, false] ? TAddReadonlyAction<Property> :
  [IsReadonly, IsOptional] extends [false, true] ? TAddOptionalAction<Property> :
  Property
)
export function EvaluatePropertyUnion<Left extends TSchema, Right extends TSchema>(left: Left, right: Right): TEvaluatePropertyUnion<Left, Right> {
  const isReadonly = IsReadonly(left) || IsReadonly(right)
  const isOptional = IsOptional(left) || IsOptional(right)
  const leftProperty = RemoveReadonlyAction(RemoveOptionalAction(left, {}), {})
  const rightProperty = RemoveReadonlyAction(RemoveOptionalAction(right, {}), {})
  const property = EvaluateUnion([leftProperty, rightProperty])
  return (
    isReadonly && isOptional ? AddReadonlyAction(AddOptionalAction(property, {}), {}) :
    isReadonly ? AddReadonlyAction(property, {}) :
    isOptional ? AddOptionalAction(property, {}) :
    property
  ) as never
}
