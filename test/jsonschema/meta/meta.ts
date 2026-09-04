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

import { Draft_2020_12 } from './draft_2020_12.ts'
import { Draft_2019_09 } from './draft_2019_09.ts'
import { Draft_7 } from './draft_7.ts'
import { Draft_6 } from './draft_6.ts'
import { Draft_4 } from './draft_4.ts'
import { Draft_3 } from './draft_3.ts'

/** Json Schema Metaschema */
export const MetaSchema = {
  'http://json-schema.org/draft-03/schema#': Draft_3,
  'http://json-schema.org/draft-04/schema#': Draft_4,
  'http://json-schema.org/draft-06/schema#': Draft_6,
  'http://json-schema.org/draft-07/schema#': Draft_7,
  'https://json-schema.org/draft/2019-09/schema': Draft_2019_09,
  'https://json-schema.org/draft/2020-12/schema': Draft_2020_12
}
