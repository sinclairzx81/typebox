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
import { type TProperties, type TSchema, IsUndefined } from '../../type/index.ts'
import { Check } from '../check/index.ts'
import { Create } from '../create/index.ts'
import { Convert } from '../convert/index.ts'

// ------------------------------------------------------------------
// CreateWhenUndefined
//
// Note: If the value is 'undefined' AND the type is not TUndefined,
// then we know the value must be created. We handle this case for
// undefined only, as it enables 'default' values to be initialized,
// which otherwise wouldn't occur when running the value through
// Convert on the first failed Check.
// ------------------------------------------------------------------
function CreateWhenUndefined(context: TProperties, type: TSchema, value: unknown): unknown {
  return (Guard.IsUndefined(value) && !IsUndefined(type)) ? Create(context, type) : value
}
export function FromUnknown(context: TProperties, type: TSchema, value: unknown): unknown {
  const candidate = CreateWhenUndefined(context, type, value)
  if (Check(context, type, candidate)) return candidate
  const converted = Convert(context, type, candidate)
  if (Check(context, type, converted)) return converted
  return Create(context, type)
}