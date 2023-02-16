/*--------------------------------------------------------------------------

@sinclair/typebox/extensions

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { Type, TSchema, TObject, TProperties, Modifier, TReadonly, TReadonlyOptional, TOptional } from '@sinclair/typebox'

// prettier-ignore
export type TReadonlyObject<T extends TObject> = TObject<{
  [K in keyof T['properties']]: 
    T['properties'][K] extends TReadonlyOptional<infer U> ? TReadonlyOptional<U> : 
    T['properties'][K] extends TReadonly<infer U>         ? TReadonly<U> : 
    T['properties'][K] extends TOptional<infer U>         ? TReadonlyOptional<U> : 
    TReadonly<T['properties'][K]>
}>

/** Remaps all properties of an object to be readonly */
export function ReadonlyObject<T extends TObject>(schema: T): TReadonlyObject<T> {
  return Type.Object(
    Object.keys(schema.properties).reduce((acc, key) => {
      const property = schema.properties[key] as TSchema
      const modifier = property[Modifier]
      // prettier-ignore
      const mapped = (
        (modifier === 'ReadonlyOptional') ? { ...property, [Modifier]: 'ReadonlyOptional' } :
        (modifier === 'Readonly')         ? { ...property, [Modifier]: 'Readonly' } :
        (modifier === 'Optional')         ? { ...property, [Modifier]: 'ReadonlyOptional' } :
        ({...property, [Modifier]: 'Readonly' })
      )
      return { ...acc, [key]: mapped }
    }, {} as TProperties),
  ) as TReadonlyObject<T>
}
