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

import { type TSchema } from '../../types/schema.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TGeneric, Generic, IsGeneric } from '../../types/generic.ts'
import { type TRef, IsRef } from '../../types/ref.ts'
import { type TParameter } from '../../types/parameter.ts'
import { type TNever, Never } from '../../types/never.ts'

// ------------------------------------------------------------------
// Fail Case: NotResolvable
// ------------------------------------------------------------------
type TFromNotResolvable = (
  ['(not-resolvable)', TNever]
)
function FromNotResolvable(): TFromNotResolvable {
  return ['(not-resolvable)', Never()]
}
// ------------------------------------------------------------------
// Fail Case: NotGeneric
// ------------------------------------------------------------------
type TFromNotGeneric = (
  ['(not-generic)', TNever]
)
function FromNotGeneric(): TFromNotGeneric {
  return ['(not-generic)', Never()]
}
// ------------------------------------------------------------------
// Generic
// ------------------------------------------------------------------
type TFromGeneric<Name extends string, Parameters extends TParameter[], Expression extends TSchema> = (
  [Name, TGeneric<Parameters, Expression>]
)
function FromGeneric<Name extends string, Parameters extends TParameter[], Expression extends TSchema>
  (name: Name, parameters: [...Parameters], expression: Expression):
    TFromGeneric<Name, Parameters, Expression> {
  return [name, Generic(parameters, expression)] as never
}
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
type TFromRef<Context extends TProperties, Ref extends string, Arguments extends TSchema[]> = (
  Ref extends keyof Context
  ? TFromType<Context, Ref, Context[Ref], Arguments>
  : TFromNotResolvable
)
function FromRef<Context extends TProperties, Ref extends string, Arguments extends TSchema[]>(context: Context, ref: Ref, arguments_: [...Arguments]): TFromRef<Context, Ref, Arguments> {
  return (
    ref in context
      ? FromType(context, ref, context[ref], arguments_)
      : FromNotResolvable()
  ) as never
}
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
type TFromType<Context extends TProperties, Name extends string, Type extends TSchema, Arguments extends TSchema[]> = (
  Type extends TGeneric<infer Parameters extends TParameter[], infer Expression extends TSchema> ? TFromGeneric<Name, Parameters, Expression> :
  Type extends TRef<infer Ref extends string> ? TFromRef<Context, Ref, Arguments> :
  TFromNotGeneric
)
function FromType<Context extends TProperties, Name extends string, Type extends TSchema, Arguments extends TSchema[]>
  (context: Context, name: Name, target: Type, arguments_: [...Arguments]):
  TFromType<Context, Name, Type, Arguments> {
  return (
    IsGeneric(target) ? FromGeneric(name, target.parameters, target.expression) :
    IsRef(target) ? FromRef(context, target.$ref, arguments_) :
    FromNotGeneric()
  ) as never
}
// ------------------------------------------------------------------
// ResolveTarget
// ------------------------------------------------------------------
/** Resolves a named generic target from the context, or returns TNever if it cannot be resolved or is not generic. */
export type TResolveTarget<Context extends TProperties, Target extends TSchema, Arguments extends TSchema[],
  Result extends [string, TSchema] = TFromType<Context, '(anonymous)', Target, Arguments>
> = Result

/** Resolves a named generic target from the context, or returns TNever if it cannot be resolved or is not generic. */
export function ResolveTarget<Context extends TProperties, Target extends TSchema, Arguments extends TSchema[]>
  (context: Context, target: Target, arguments_: [...Arguments]):
  TFromType<Context, '(anonymous)', Target, Arguments> {
  return FromType(context, '(anonymous)', target, arguments_)
}