import { Hashing } from 'typebox/system'
import * as F from 'typebox/format'
import * as S from 'typebox/schema'
// ------------------------------------------------------------------
// External
// ------------------------------------------------------------------
const External = [F.IsEmail]
// ------------------------------------------------------------------
// Schemas
// ------------------------------------------------------------------
export function Context() {
  return {}
}
export function Schema() {
  return {"type":"object","required":["x","y","w"],"properties":{"x":{"type":"number"},"y":{"type":"string","format":"email"},"w":{"type":"array","items":{"type":"string"},"uniqueItems":true}}}
}
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
const check_0 = ((value) => ((typeof value === "object" && value !== null && !(Array.isArray(value))) && ((("x" in value && "y" in value) && "w" in value) && ((Number.isFinite(value.x) && (typeof value.y === "string" && External[0](value.y))) && (Array.isArray(value.w) && (value.w.every((element, index) => (typeof element === "string")) && new Set(value.w.map(Hashing.Hash)).size === value.w.length))))))
// ------------------------------------------------------------------
// Export
// ------------------------------------------------------------------
export function Check(value) {
  return check_0(value)
}
export function Parse(value) {
  if(Check(value)) return value
  throw new S.ParseError(Schema(), value, Errors(value)[1])
}
export function Errors(value) {
  return S.Errors(Context(), Schema(), value)
}
// ------------------------------------------------------------------
// Default
// ------------------------------------------------------------------
export default { Schema, Context, Check, Parse, Errors }