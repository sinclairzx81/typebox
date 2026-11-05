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

import { Guard } from '../../guard/index.ts'
import { Memory } from '../../system/memory/index.ts'
import { type StaticType, type StaticDirection } from './static.ts'
import { type TSchema, type TSchemaOptions, IsKind } from './schema.ts'
import { type TProperties } from './properties.ts'
import { type TAny } from './any.ts'
import { type TUnknown } from './unknown.ts'

// ------------------------------------------------------------------
// TerminatingContext
//
// We support one level of recursive inference; anything past that
// point is inferred as TAny. The transform to TCyclic here is
// required to ensure re-dispatch via StaticType. The intent is to
// keep TCyclic inference local to this module, and to prevent naive
// inference via TRef, which would otherwise result in instantiation
// depth errors.
// ------------------------------------------------------------------
type TerminatingContext<Defs extends TProperties, Ref extends string> = (
  Ref extends keyof Defs
    ? Defs[Ref] extends { terminate: true }
      ? Omit<Defs, Ref> & { [_ in Ref]: TAny } // terminate with TAny
      : Omit<Defs, Ref> & { [_ in Ref]: TCyclic<Defs & { [_ in Ref]: Defs[Ref] & { terminate: true } }, Ref> }
    : Defs
)
// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
export type StaticCyclic<Direction extends StaticDirection, _Context extends TProperties, This extends TProperties, Defs extends TProperties, Ref extends string,
  Target extends TSchema = Ref extends keyof Defs ? Defs[Ref] : TUnknown,
  Result extends unknown = StaticType<Direction, TerminatingContext<Defs, Ref>, This, Target>
> = Result
// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
/** Represents a Cyclic type. */
export interface TCyclic<Defs extends TProperties = TProperties, Ref extends string = string> extends TSchema {
  '~kind': 'Cyclic'
  $defs: Defs
  $ref: Ref
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates a Cyclic type. */
export function Cyclic<Defs extends TProperties, Ref extends string>($defs: Defs, $ref: Ref, options?: TSchemaOptions): TCyclic<Defs, Ref> {
  // $defs require an $id per definition to enable Ajv to resolve correctly
  const defs = Guard.Keys($defs).reduce((result, key) => {
    return { ...result, [key]: Memory.Update($defs[key], {}, { $id: key }) }
  }, {} as TProperties)
  return Memory.Create({ ['~kind']: 'Cyclic' }, { $defs: defs, $ref }, options) as never
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** Returns true if the given value is a TCyclic. */
export function IsCyclic(value: unknown): value is TCyclic {
  return IsKind(value, 'Cyclic')
}
// ------------------------------------------------------------------
// Options
// ------------------------------------------------------------------
/** Extracts options from a TCyclic. */
export function CyclicOptions(type: TCyclic): TSchemaOptions {
  return Memory.Discard(type, ['~kind', '$defs', '$ref'])
}