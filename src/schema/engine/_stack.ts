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

import { Guard } from '../../guard/index.ts'
import * as Schema from '../types/index.ts'

// ------------------------------------------------------------------
// DefaultUri
// ------------------------------------------------------------------
export const DefaultUri = 'urn:typebox:root'

// ------------------------------------------------------------------
// XStack
//
// Immutable frame tracking traversal and resolution state for a
// single schema visit.
// ------------------------------------------------------------------
export interface XStack {
  /** The schema context. */
  readonly context: Record<string, Schema.XSchema>
  /** The entry schema. */
  readonly schema: Schema.XSchema
  /** Visited $id schemas, kept only to detect resource re-entry (see resolve.ts FindResolvedResource). */
  readonly ids: Schema.XId[]
  /** Nearest enclosing $id schema, used as the root for local pointer resolution. */
  readonly lexicalSchema: Schema.XSchema
  /** First $recursiveAnchor: true schema seen on the path. */
  readonly recursiveAnchor: Schema.XRecursiveAnchor | undefined
  /** Dynamic anchors visible at this point in the traversal. */
  readonly dynamicAnchors: Schema.XDynamicAnchor[]
  /** Lexical base URL, used to resolve relative $id and $ref values within the current schema. */
  readonly lexicalBase: string
  /** Base URL of the current resource, reset each time a new resource $id is entered. */
  readonly resourceBase: string
  /** Base URL that $ref values resolve against. */
  readonly referenceBase: string
  /** Resource entry point bookkeeping: schema -> the base/root to apply when that schema is next pushed. */
  readonly resourceEntries: Map<Schema.XSchemaObject, { base: string; root: Schema.XSchemaObject }>
  /** True while referenceBase should track resourceBase rather than lexicalBase. */
  readonly useResourceBaseForReference: boolean
  /** True until the next $id schema is entered, marking it as a fresh resource root. */
  readonly pendingResource: boolean
  /** True once traversal has entered a retrieved or legacy resource. */
  readonly enteredResource: boolean
}
// ------------------------------------------------------------------
// NextUri
//
// Resolves a relative or absolute ref against a base URI or URN.
// Hierarchical bases (http, https, etc.) resolve using the normal
// URL rules. URN bases have no path to resolve against, so the ref
// is appended after the base's last ':' segment instead.
// ------------------------------------------------------------------
export function NextUri(ref: string, base: string): URL {
  return (URL.canParse(ref, base)) ? new URL(ref, base) : Guard.IsEqual(base, DefaultUri) ? new URL(`${base}:${ref}`) : new URL(`${base.slice(0, base.lastIndexOf(':'))}:${ref}`)
}
// ------------------------------------------------------------------
// Stack
//
// Creates the root frame a schema traversal starts from.
// ------------------------------------------------------------------
export function Stack(context: Record<string, Schema.XSchema>, schema: Schema.XSchema): XStack {
  const base = Schema.IsSchemaObject(schema) && Schema.IsId(schema) ? NextUri(schema.$id, DefaultUri).href : DefaultUri
  return {
    context,
    schema,
    lexicalSchema: schema,
    lexicalBase: base,
    resourceBase: base,
    referenceBase: base,
    ids: [],
    useResourceBaseForReference: true,
    recursiveAnchor: undefined,
    dynamicAnchors: [],
    resourceEntries: new Map(),
    pendingResource: true,
    enteredResource: false
  }
}
// ------------------------------------------------------------------
// RegisterResourceAnchors
//
// Collects $dynamicAnchor schemas reachable from a resource root,
// stopping at nested $id boundaries which own their own anchors.
// ------------------------------------------------------------------
function RegisterResourceAnchors(anchors: Schema.XDynamicAnchor[], schema: unknown, isRoot: boolean = true): Schema.XDynamicAnchor[] {
  if (Schema.IsSchemaBoolean(schema)) return anchors
  if (Array.isArray(schema)) return schema.reduce((result, item) => RegisterResourceAnchors(result, item, false), anchors)
  if (!Schema.IsSchemaObject(schema)) return anchors
  if (!isRoot && Schema.IsId(schema)) return anchors
  const next = !isRoot && Schema.IsDynamicAnchor(schema) ? [...anchors, schema] : anchors
  return Object.keys(schema).reduce((result, key) => RegisterResourceAnchors(result, (schema as never)[key], false), next)
}
// ------------------------------------------------------------------
// ResourceEntry
//
// A ref crossing (Resolve.Ref) may have marked `schema` as the entry
// point of a retrieved/legacy resource. If so the frame resets to
// that resource's base/root instead of chaining onto the parent.
// ------------------------------------------------------------------
function ResourceEntry(stack: XStack, schema: Schema.XSchemaObject): { base: string; root: Schema.XSchemaObject } | undefined {
  return stack.resourceEntries.get(schema)
}
function NextEnteredResource(stack: XStack, schema: Schema.XSchemaObject): boolean {
  return stack.enteredResource || ResourceEntry(stack, schema) !== undefined
}
// ------------------------------------------------------------------
// NextStack
//
// Each Next* helper below computes one XStack field in isolation from
// the previous frame and the schema being pushed.
// ------------------------------------------------------------------
function IsRelativeId(schema: Schema.XId): boolean {
  return !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(schema.$id)
}
function NextIds(stack: XStack, schema: Schema.XSchemaObject): Schema.XId[] {
  return Schema.IsId(schema) ? [...stack.ids, schema] : stack.ids
}
function NextRecursiveAnchor(stack: XStack, schema: Schema.XSchemaObject): Schema.XRecursiveAnchor | undefined {
  return stack.recursiveAnchor ?? (Schema.IsRecursiveAnchorTrue(schema) ? schema : undefined)
}
function NextDynamicAnchors(stack: XStack, schema: Schema.XSchemaObject): Schema.XDynamicAnchor[] {
  const registered = Schema.IsId(schema) ? RegisterResourceAnchors(stack.dynamicAnchors, schema) : stack.dynamicAnchors
  return Schema.IsDynamicAnchor(schema) ? [...registered, schema] : registered
}
function NextPendingResource(stack: XStack, schema: Schema.XSchemaObject): boolean {
  return Schema.IsId(schema) ? false : stack.pendingResource
}
function NextLexicalBase(stack: XStack, schema: Schema.XSchemaObject): string {
  const entry = ResourceEntry(stack, schema)
  if (entry) return entry.base
  return Schema.IsId(schema) ? NextUri(schema.$id, stack.lexicalBase).href : stack.lexicalBase
}
function NextResourceBase(stack: XStack, schema: Schema.XSchemaObject): string {
  const entry = ResourceEntry(stack, schema)
  if (entry) return entry.base
  return (Schema.IsId(schema) && stack.pendingResource) ? NextUri(schema.$id, stack.resourceBase).href : stack.resourceBase
}
function NextUseResourceBaseForReference(stack: XStack, schema: Schema.XSchemaObject): boolean {
  return Schema.IsId(schema) ? !IsRelativeId(schema) : stack.useResourceBaseForReference
}
function NextReferenceBase(stack: XStack, schema: Schema.XSchemaObject): string {
  const isRetrieved = NextEnteredResource(stack, schema)
  const useResourceBaseForReference = NextUseResourceBaseForReference(stack, schema)
  return (isRetrieved || useResourceBaseForReference) ? NextResourceBase(stack, schema) : NextLexicalBase(stack, schema)
}
function NextLexicalSchema(stack: XStack, schema: Schema.XSchemaObject): Schema.XSchema {
  const entry = ResourceEntry(stack, schema)
  if (entry) return entry.root
  return Schema.IsId(schema) ? schema : stack.lexicalSchema
}
// ------------------------------------------------------------------
// NextStack | HasStackKeywords (Optimization)
//
// HasStackKeywords narrows schema to an object and checks whether it
// carries $id, $dynamicAnchor, a first-seen $recursiveAnchor, or a
// resource-entry point. When none apply, NextStack skips the frame
// rebuild and returns the parent stack as-is.
// ------------------------------------------------------------------
function HasStackKeywords(stack: XStack, schema: Schema.XSchema): schema is Schema.XSchemaObject {
  return Schema.IsSchemaObject(schema) && (
    Schema.IsId(schema) ||
    Schema.IsDynamicAnchor(schema) ||
    (Guard.IsUndefined(stack.recursiveAnchor) && Schema.IsRecursiveAnchorTrue(schema)) ||
    !Guard.IsUndefined(ResourceEntry(stack, schema))
  )
}
export function NextStack(stack: XStack, schema: Schema.XSchema): XStack {
  return HasStackKeywords(stack, schema)
    ? {
      ...stack,
      ids: NextIds(stack, schema),
      dynamicAnchors: NextDynamicAnchors(stack, schema),
      recursiveAnchor: NextRecursiveAnchor(stack, schema),
      pendingResource: NextPendingResource(stack, schema),
      lexicalBase: NextLexicalBase(stack, schema),
      resourceBase: NextResourceBase(stack, schema),
      useResourceBaseForReference: NextUseResourceBaseForReference(stack, schema),
      referenceBase: NextReferenceBase(stack, schema),
      lexicalSchema: NextLexicalSchema(stack, schema),
      enteredResource: NextEnteredResource(stack, schema)
    }
    : stack
}
