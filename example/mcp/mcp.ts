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

import { type Static } from 'typebox'

import _2024_11_05 from './2024-11-05.json' with { type: 'json' }
import _2025_03_26 from './2025-03-26.json' with { type: 'json' }
import _2025_06_18 from './2025-06-18.json' with { type: 'json' }
import _Draft from './draft.json' with { type: 'json' }
type AutoSpec<Defs extends string, Spec extends { [_ in Defs]: Record<string, unknown> }> = {
  [Key in Extract<keyof Spec[Defs], string>]: Static<Spec & { $ref: `#/${Defs}/${Key}` }>
}

type _2024_11_05 = AutoSpec<'definitions', typeof _2024_11_05>
type _2025_03_26 = AutoSpec<'definitions', typeof _2025_03_26>
type _2025_06_18 = AutoSpec<'definitions', typeof _2025_06_18>
type _Draft = AutoSpec<'$defs', typeof _Draft>

export type X2024_11_05 = _2024_11_05
export type X2025_03_26 = _2025_03_26
export type X2025_06_18 = _2025_06_18
export type XDraft = _Draft