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
import { type XSchemaObject, type XSchema, IsSchema } from './schema.ts'

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
export interface XItemsSized<Items extends XSchema[] = XSchema[]> {
  items: Items
}
export interface XItemsUnsized<Items extends XSchema = XSchema> {
  items: Items
}
export interface XItems<Items extends (XSchema | XSchema[]) = (XSchema | XSchema[])> {
  items: Items
}
// ------------------------------------------------------------------
// Guard
// ------------------------------------------------------------------
/** 
 * Returns true if the schema contains a valid items property
 * @specification Json Schema 7
 */
export function IsItems(schema: XSchemaObject): schema is XItems {
  return Guard.HasPropertyKey(schema, 'items') 
    && (IsSchema(schema.items) 
    || (Guard.IsArray(schema.items) 
        && schema.items.every(value => {
          return IsSchema(value)
  })))
}
/** Returns true if this schema is a sized items variant */
export function IsItemsSized(schema: XSchemaObject): schema is XItemsSized {
  return IsItems(schema) && Guard.IsArray(schema.items)
}
/** Returns true if this schema is a unsized items variant */
export function IsItemsUnsized(schema: XSchemaObject): schema is XItemsUnsized {
  return IsItems(schema) && !Guard.IsArray(schema.items)
}