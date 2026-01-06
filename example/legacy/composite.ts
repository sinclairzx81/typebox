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

import Type from 'typebox'

// ------------------------------------------------------------------
// FromProperties
// ------------------------------------------------------------------
type TFromProperties<Left extends Type.TProperties, Right extends Type.TProperties,
  Select extends Type.TProperties = Omit<Left, keyof Right> & Right,
  Result extends Type.TProperties = { [K in keyof Select]: Select[K] }
> = Result

function FromProperties<Left extends Type.TProperties, Right extends Type.TProperties>
  (left: Left, right: Right): TFromProperties<Left, Right> {
  return { ...left, ...right } as never
}
// ------------------------------------------------------------------
// FromType
// ------------------------------------------------------------------
type TFromType<Type extends Type.TSchema, Result extends Type.TProperties> = (
  Type extends Type.TObject<infer Properties extends Type.TProperties>
    ? TFromProperties<Result, Properties>
    : Result
)
function FromType<Type extends Type.TSchema, Result extends Type.TProperties>
  (type: Type, result: Result): TFromType<Type, Result> {
  return (
    Type.IsObject(type) ? FromProperties(result, type.properties) :
    result
  ) as never
}
// ------------------------------------------------------------------
// FromTypes
// ------------------------------------------------------------------
type TFromTypes<Types extends Type.TSchema[], Result extends Type.TProperties = {}> = (
  Types extends [infer Left extends Type.TSchema, ...infer Right extends Type.TSchema[]]
    ? TFromTypes<Right, TFromType<Left, Result>>
    : Result
)
function FromTypes<Types extends Type.TSchema[]>(types: [...Types]): TFromTypes<Types> {
  return types.reduce((result, left) => {
    return FromType(left, result)
  }, {}) as never
}
// ------------------------------------------------------------------
// Composite
// ------------------------------------------------------------------
/** Fallback for 0.34.x Composite.  */
export type TComposite<Types extends Type.TObject[], 
  Properties extends Type.TProperties = TFromTypes<Types>,
  Result extends Type.TSchema = Type.TObject<Properties>
> = Result
/** Fallback for 0.34.x Composite.  */
export function Composite<Types extends Type.TObject[]>(types: [...Types]): TComposite<Types> {
  const properties = FromTypes(types)
  const result = Type.Object(properties)
  return result as never
}