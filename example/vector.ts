import { Hashing } from 'typebox/system'
import * as F from 'typebox/format'
import * as E from 'typebox/error'
import * as S from 'typebox/schema'
// ------------------------------------------------------------------
// External
// ------------------------------------------------------------------
// @ts-ignore
const External = [F.IsEmail]
// ------------------------------------------------------------------
// Schemas
// ------------------------------------------------------------------
export function Context(): Record<string, Record<string, unknown> | boolean> {
  return {}
}
export function Schema(): Record<string, unknown> | boolean {
  return {"type":"object","required":["x","y","w"],"properties":{"x":{"type":"number"},"y":{"type":"string","format":"email"},"w":{"type":"array","items":{"type":"string"},"uniqueItems":true}}}
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
// @ts-ignore
const check_0 = ((value) => ((typeof value === "object" && value !== null && !(Array.isArray(value))) && ((("x" in value && "y" in value) && "w" in value) && ((Number.isFinite(value.x) && (typeof value.y === "string" && External[0](value.y))) && (Array.isArray(value.w) && (value.w.every((element, index) => (typeof element === "string")) && new Set(value.w.map(Hashing.Hash)).size === value.w.length))))))
// ------------------------------------------------------------------
// Static
// ------------------------------------------------------------------
namespace Module {
  export type Static = { x: number, y: string, w: string[] & {} } & {} & object
}
// ------------------------------------------------------------------
// Export
// ------------------------------------------------------------------
export function Check(value: unknown): value is Module.Static {
  return check_0(value)
}
export function Parse(value: unknown): Module.Static {
  if(Check(value)) return value
  throw new S.ParseError(Schema(), value, Errors(value)[1])
}
export function Errors(value: unknown): [boolean, E.TLocalizedValidationError[]] {
  return S.Errors(Context(), Schema(), value)
}
// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
const Module = { Schema, Context, Check, Parse, Errors }
export default Module