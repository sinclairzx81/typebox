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

import * as Schema from '../../../schema/index.ts'

import { StaticAdditionalProperties } from './additionalProperties.ts'
import { StaticAllOf } from './allOf.ts'
import { StaticAnyOf } from './anyOf.ts'
import { StaticConst } from './const.ts'
import { StaticEnum } from './enum.ts'
import { StaticIf } from './if.ts'
import { StaticItems } from './items.ts'
import { StaticOneOf } from './oneOf.ts'
import { StaticPatternProperties } from './patternProperties.ts'
import { StaticPrefixItems } from './prefixItems.ts'
import { StaticProperties } from './properties.ts'
import { StaticPropertyNames } from './propertyNames.ts'
import { StaticRef } from './ref.ts'
import { StaticRequired } from './required.ts'
import { StaticType } from './type.ts'
import { StaticUnevaluatedProperties } from './unevaluatedProperties.ts'

// ------------------------------------------------------------------
// FromKeywords
// ------------------------------------------------------------------
function FromKeywords(stack: string[], root: Schema.XSchema, schema: unknown): string[] {
  if (!Schema.IsSchema(schema)) return ['unknown']
  if (Schema.IsSchemaBoolean(schema)) return [`${schema}`]
  const result: string[] = []
  if (Schema.IsAdditionalProperties(schema)) result.push(StaticAdditionalProperties(stack, root, schema.additionalProperties))
  if (Schema.IsAllOf(schema)) result.push(StaticAllOf(stack, root, schema.allOf))
  if (Schema.IsAnyOf(schema)) result.push(StaticAnyOf(stack, root, schema.anyOf))
  if (Schema.IsConst(schema)) result.push(StaticConst(schema.const))
  if (Schema.IsIf(schema)) result.push(StaticIf(stack, root, schema, schema.if))
  if (Schema.IsEnum(schema)) result.push(StaticEnum(schema.enum))
  if (Schema.IsItems(schema)) result.push(StaticItems(stack, root, schema, schema.items))
  if (Schema.IsOneOf(schema)) result.push(StaticOneOf(stack, root, schema.oneOf))
  if (Schema.IsPatternProperties(schema)) result.push(StaticPatternProperties(stack, root, schema.patternProperties))
  if (Schema.IsPrefixItems(schema)) result.push(StaticPrefixItems(stack, root, schema, schema.prefixItems))
  if (Schema.IsProperties(schema)) result.push(StaticProperties(stack, root, schema, schema.properties))
  if (Schema.IsPropertyNames(schema)) result.push(StaticPropertyNames(stack, root, schema.propertyNames))
  if (Schema.IsRef(schema)) result.push(StaticRef(stack, root, schema.$ref))
  if (Schema.IsRequired(schema)) result.push(StaticRequired(stack, root, schema, schema.required))
  if (Schema.IsType(schema)) result.push(StaticType(schema.type))
  if (Schema.IsUnevaluatedProperties(schema)) result.push(StaticUnevaluatedProperties(stack, root, schema.unevaluatedProperties))
  return result.length === 0 ? ['unknown'] : result
}
// ------------------------------------------------------------------
// KeywordsIntersected
// ------------------------------------------------------------------
function KeywordsIntersected(schemas: string[]): string {
  return schemas.length === 0 ? 'unknown' : schemas.join(' & ')
}
// ------------------------------------------------------------------
// KeywordsEvaluated
// ------------------------------------------------------------------
function KeywordsEvaluated(schema: string): string {
  return schema // todo: should we Evaluate?
}
// ------------------------------------------------------------------
// StaticObject
// ------------------------------------------------------------------
export function StaticObject(stack: string[], root: Schema.XSchema, schema: Schema.XSchema) {
  const keywords = FromKeywords(stack, root, schema)
  const intersected = KeywordsIntersected(keywords)
  const evaluated = KeywordsEvaluated(intersected)
  return evaluated
}
// ------------------------------------------------------------------
// StaticBoolean
// ------------------------------------------------------------------
export function StaticBoolean(schema: boolean) {
  return schema ? 'unknown' : 'never'
}
// ------------------------------------------------------------------
// StaticSchema
// ------------------------------------------------------------------
export function StaticSchema(stack: string[], root: Schema.XSchema, schema: Schema.XSchema): string {
  return Schema.IsSchemaBoolean(schema) ? StaticBoolean(schema) : StaticObject(stack, root, schema)
}
