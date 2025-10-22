import { Guard } from '../../guard/index.ts'
import * as S from '../types/index.ts'
import { Ref } from './ref.ts'

// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
function FromArray(value: unknown[], anchor: unknown, ref: S.XRecursiveRef): unknown {
  for (const item of value) {
    const resolved = FromValue(item, anchor, ref)
    if (!Guard.IsUndefined(resolved)) return resolved
  }
  return undefined
}
// ------------------------------------------------------------------
// FromObject
// ------------------------------------------------------------------
function FromObject(value: Record<PropertyKey, unknown>, anchor: unknown, ref: S.XRecursiveRef): unknown {
  for (const key of Guard.Keys(value)) {
    const resolved = FromValue(value[key], anchor, ref)
    if (!Guard.IsUndefined(resolved)) return resolved
  }
  return undefined
}
// ------------------------------------------------------------------
// FromValue
// ------------------------------------------------------------------
function FromValue(value: unknown, anchor: unknown, ref: S.XRecursiveRef): unknown {
  if (Guard.IsObjectNotArray(value) && S.IsRecursiveAnchor(value)) {
    anchor = value
  }
  if (value === ref) return Ref(anchor, ref.$recursiveRef)
  if (Guard.IsArray(value)) return FromArray(value, anchor, ref)
  if (Guard.IsObject(value)) return FromObject(value, anchor, ref)
  return undefined
}

// ------------------------------------------------------------------
// RecursiveRef
// ------------------------------------------------------------------
export function RecursiveRef(schema: unknown, ref: S.XRecursiveRef): unknown {
  const anchor = schema
  return FromValue(schema, anchor, ref)
}
