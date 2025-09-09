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

import { type TSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TExtendsLeft, ExtendsLeft } from './extends-left.ts'
import { type TTemplateLiteralDecode, TemplateLiteralDecode } from '../engine/template-literal/decode.ts'

// Note: We currently do not support patterned extends checks. To support them, TypeBox
// would need to implement sub string comparison checks for patterned sub expressions; and 
// and it is not immediately obvious how to best achieve that. This logic below uses the 
// template literal pattern decode system which will given either a Union or String depending 
// finite tests, this is re-routed back into extends check as the decoded type.

export type TExtendsTemplateLiteral<Inferred extends TProperties, Left extends string, Right extends TSchema,
  Decoded extends TSchema = TTemplateLiteralDecode<Left>
> = TExtendsLeft<Inferred, Decoded, Right>

export function ExtendsTemplateLiteral<Inferred extends TProperties, Left extends string, Right extends TSchema>
  (inferred: Inferred, left: Left, right: Right): 
    TExtendsTemplateLiteral<Inferred, Left, Right> {
  const decoded = TemplateLiteralDecode(left)
  return ExtendsLeft(inferred, decoded, right)
}
