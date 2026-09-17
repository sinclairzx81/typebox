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

// ------------------------------------------------------------------
// 1: WithElements
// ------------------------------------------------------------------
function WithElements(stack: string[], root: Schema.XSchema, schemas: Schema.XSchema[]): string[] {
  return schemas.map((schema) => StaticSchema([...stack], root, schema))
}
// ------------------------------------------------------------------
// 2. WithMaxItems - Truncate to MaxItems
// ------------------------------------------------------------------
function WithMaxItems(schema: Schema.XSchemaObject, elements: string[]): string[] {
  return Schema.IsMaxItems(schema) ? elements.slice(0, schema.maxItems) : elements
}
// ------------------------------------------------------------------
// 3. NeedsAdditionalItems - Does MaxItems constrain all Elements?
// ------------------------------------------------------------------
function NeedsAdditionalItems(schema: Schema.XSchemaObject, elements: string[]): boolean {
  return Schema.IsMaxItems(schema) ? elements.length < schema.maxItems : true
}
// ------------------------------------------------------------------
// 4. WithMinItems - Optional Indices > MinItems
// ------------------------------------------------------------------
function WithMinItems(schema: Schema.XSchemaObject, elements: string[]): string[] {
  const minItems = Schema.IsMinItems(schema) ? schema.minItems : 0
  return elements.map((element, index) => index < minItems ? element : `${element}?`)
}
// ------------------------------------------------------------------
// 5. WithAdditionalItems - Append with ...T[]
// ------------------------------------------------------------------
function WithAdditionalItems(stack: string[], root: Schema.XSchema, schema: Schema.XSchemaObject, elements: string[]): string[] {
  if (!Schema.IsAdditionalItems(schema)) return [...elements, '...unknown[]']
  const additionalItems = schema.additionalItems
  return (
    additionalItems === true ? [...elements, '...unknown[]'] : additionalItems === false ? [...elements] : [...elements, `...${StaticSchema([...stack], root, additionalItems)}[]`]
  )
}
// ------------------------------------------------------------------
// StaticElements
// ------------------------------------------------------------------
export function StaticElements(stack: string[], root: Schema.XSchema, schema: Schema.XSchemaObject, prefixItems: Schema.XSchema[]): string[] {
  const withElements = WithElements(stack, root, prefixItems)
  const withMaxItems = WithMaxItems(schema, withElements)
  const needsAdditional = NeedsAdditionalItems(schema, withMaxItems)
  const withMinItems = WithMinItems(schema, withMaxItems)
  return needsAdditional ? WithAdditionalItems(stack, root, schema, withMinItems) : withMinItems
}
