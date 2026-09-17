import * as Schema from '../../schema/index.ts'
import { StaticSchema } from './schema.ts'

// ------------------------------------------------------------------
// REVIEW: SHOULD USE TYPE.* NUMERIC and STRING PATTERNS
// ------------------------------------------------------------------
const StringLiteralPattern = /^".*"$/
const NumericLiteralPattern = /^-?\d+(\.\d+)?$/
function IsStringLiteral(value: string): boolean {
  return StringLiteralPattern.test(value)
}
function IsNumericLiteral(value: string): boolean {
  return NumericLiteralPattern.test(value)
}
// ------------------------------------------------------------------
// Utility: PropertyKey-compatibility check
// ------------------------------------------------------------------
function IsPropertyKeyMember(member: string): boolean {
  const trimmed = member.trim()
  return (
    trimmed === 'string' ||
    trimmed === 'number' ||
    trimmed === 'symbol' ||
    IsStringLiteral(trimmed) ||
    IsNumericLiteral(trimmed)
  )
}
function IsPropertyKeyLike(staticKey: string): boolean {
  return staticKey.split('|').every((member) => IsPropertyKeyMember(member))
}
// ------------------------------------------------------------------
// XStaticPropertyNames
// ------------------------------------------------------------------
export function StaticPropertyNames(stack: string[], root: Schema.XSchema, schema: Schema.XSchema): string {
  const staticKey = StaticSchema([...stack], root, schema)
  return IsPropertyKeyLike(staticKey) ? `{ [Key in ${staticKey}]?: unknown }` : '{}'
}
