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

import * as Schema from '../../schema/index.ts'
import { StaticSchema } from './schema.ts'

export function StaticIf(stack: string[], root: Schema.XSchema, schema: Schema.XSchemaObject, ifSchema: Schema.XSchema): string {
  const ifResult = StaticSchema([...stack], root, ifSchema)
  const isThen = Schema.IsThen(schema)
  const isElse = Schema.IsElse(schema)
  const thenResult = isThen ? StaticSchema([...stack], root, schema.then) : 'never'
  const elseResult = isElse ? StaticSchema([...stack], root, schema.else) : 'never'
  return (
    isThen && isElse ? `(${ifResult} & ${thenResult}) | Exclude<${elseResult}, ${ifResult}>` : isThen ? `(${ifResult} & ${thenResult})` : isElse ? `Exclude<${elseResult}, ${ifResult}>` : 'unknown'
  )
}
