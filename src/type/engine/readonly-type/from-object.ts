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

import { Guard } from '../../../guard/index.ts'
import { type TSchema } from '../../types/schema.ts'
import { type TObject, Object } from '../../types/object.ts'
import { type TReadonlyAdd, Readonly } from '../../types/_readonly.ts'
import { type TProperties } from '../../types/properties.ts'

export type TFromObject<Properties extends TProperties,
  Mapped extends TProperties = { [Key in keyof Properties]: TReadonlyAdd<Properties[Key]> },
  Result extends TSchema = TObject<Mapped>
> = Result
export function FromObject<Properties extends TProperties>(properties: Properties): TFromObject<Properties> {
  const mapped = Guard.Keys(properties).reduce((result, left) => {
    return { ...result, [left]: Readonly(properties[left]) }
  }, {} as TProperties)
  const result = Object(mapped)
  return result as never
}