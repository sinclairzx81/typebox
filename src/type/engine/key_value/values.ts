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
import { type TProperties } from '../../types/properties.ts'
import { type TKeyValue } from '../../types/_key_value.ts'
import { type TKeyValues, KeyValues } from './key_values.ts'

// ------------------------------------------------------------------
// KeyValuesToValues
// ------------------------------------------------------------------
type TKeyValuesToValues<KeyValues extends TKeyValue[], Result extends TSchema[] = []> = (
  KeyValues extends [infer Left extends TKeyValue, ...infer Right extends TKeyValue[]]
    ? TKeyValuesToValues<Right, [...Result, Left['value']]>
    : Result
)
function KeyValuesToValues<KeyValues extends TKeyValue[]>
  (keyValues: [...KeyValues]): TKeyValuesToValues<KeyValues> {
  return keyValues.map(keyValue => keyValue.value) as never
}
// ------------------------------------------------------------------
// Values
// ------------------------------------------------------------------
/** (Internal) Extracts Values from the given Type */
export type TValues<Context extends TProperties, Type extends TSchema,
  KeyValues extends TKeyValue[] = TKeyValues<Context, Type>,
  Result extends TSchema[] = TKeyValuesToValues<KeyValues>
>  = Result
/** (Internal) Extracts Values from the given Type */
export function Values<Context extends TProperties, Type extends TSchema>
  (context: Context, type: Type): TValues<Context, Type> {
  const keyValues = KeyValues(context, type) as TKeyValue[]
  const result = KeyValuesToValues(keyValues)
  return result as never
}



