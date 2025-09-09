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
import { type TObject, Object } from '../../types/object.ts'
import { type TProperties } from '../../types/properties.ts'
import { type TTuple } from '../../types/tuple.ts'

// ------------------------------------------------------------------
// TupleElementsToProperties
// ------------------------------------------------------------------
export type TTupleElementsToProperties<Types extends TSchema[], Result extends TProperties = {}> = (
  Types extends [...infer Left extends TSchema[], infer Right extends TSchema]
    ? TTupleElementsToProperties<Left, { [_ in Left['length']]: Right } & Result>
    : { [Key in keyof Result]: Result[Key] }
)
export function TupleElementsToProperties<Types extends TSchema[]>(types: [...Types]): TTupleElementsToProperties<Types> {
  const result = types.reduceRight((result, right, index) => {
    return { [index]: right, ...result }
  }, {} as TProperties)
  return result as never
}
// ------------------------------------------------------------------
// TupleToObject
// ------------------------------------------------------------------
export type TTupleToObject<Type extends TTuple,
  Properties extends TProperties = TTupleElementsToProperties<Type['items']>,
  Result extends TSchema = TObject<Properties>
> = Result
export function TupleToObject<Type extends TTuple>(type: Type): TTupleToObject<Type> {
  const properties = TupleElementsToProperties(type.items)
  const result = Object(properties)
  return result as never
}