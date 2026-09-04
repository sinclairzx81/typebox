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

import * as Schema from '../types/index.ts'
import { Guard } from '../../guard/index.ts'
import { Resolve } from '../resolve/index.ts'

// --------------------------------------------------------------------------
// Stack
//
// Tracks traversal state ($ids, $anchors, stack frames) and applies scope
// updates. Reference resolution rules ($ref, $dynamicRef) are delegated to
// the Resolve functions using state snapshots (Resolve.Scope).
// --------------------------------------------------------------------------
export class Stack {
  private readonly ids: Schema.XId[] = []
  private readonly resourceIds: Schema.XId[] = []
  private readonly anchors: Schema.XAnchor[] = []
  private readonly recursiveAnchors: Schema.XRecursiveAnchor[] = []
  private readonly dynamicAnchors: Schema.XDynamicAnchor[] = []
  private readonly retrievedResources: Map<Schema.XSchemaObject, { base: string; root: Schema.XSchemaObject }> = new Map()
  private readonly retrievedFrames: { schema: Schema.XSchemaObject; base: string; idDepth: number; resourceDepth: number }[] = []
  private readonly resolvedResources: Map<Schema.XSchemaObject, Schema.XId> = new Map()
  private pendingResource: boolean = true
  constructor(
    private readonly context: Record<PropertyKey, Schema.XSchema>,
    private readonly schema: Schema.XSchema
  ) {}
  // ----------------------------------------------------------------
  // LexicalBaseURL
  // ----------------------------------------------------------------
  public LexicalBaseURL(): string {
    return this.#BuildBase(this.ids)
  }
  // ----------------------------------------------------------------
  // Push
  // ----------------------------------------------------------------
  public Push(schema: Schema.XSchema) {
    if (!Schema.IsSchemaObject(schema)) return
    if (Schema.IsId(schema)) this.#RegisterResource(schema)
    if (Schema.IsAnchor(schema)) this.anchors.push(schema)
    if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.push(schema)
    if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.push(schema)
    const retrievedResource = this.retrievedResources.get(schema)
    if (retrievedResource) {
      this.retrievedFrames.push({
        schema: retrievedResource.root,
        base: retrievedResource.base,
        idDepth: this.ids.length,
        resourceDepth: this.resourceIds.length
      })
    }
  }
  // ----------------------------------------------------------------
  // Pop
  // ----------------------------------------------------------------
  public Pop(schema: Schema.XSchema) {
    if (!Schema.IsSchemaObject(schema)) return
    if (Schema.IsId(schema)) this.#UnregisterResource(schema)
    if (Schema.IsAnchor(schema)) this.anchors.pop()
    if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.pop()
    if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.pop()
    if (this.retrievedResources.has(schema)) this.retrievedFrames.pop()
    this.#ExitResolvedResource(schema)
  }
  // ----------------------------------------------------------------
  // Ref
  // ----------------------------------------------------------------
  public Ref(ref: Schema.XRef): Schema.XSchema | undefined {
    const result = Resolve.ResolveRef(this.#StackFrame(), ref)
    this.#ApplyRefResult(result)
    return result.schema
  }
  // ----------------------------------------------------------------
  // RecursiveRef
  // ----------------------------------------------------------------
  public RecursiveRef(recursiveRef: Schema.XRecursiveRef): Schema.XSchema | undefined {
    const result = Resolve.ResolveRecursiveRef(this.#StackFrame(), recursiveRef)
    if (result) this.pendingResource = true
    return result
  }
  // ----------------------------------------------------------------
  // DynamicRef
  // ----------------------------------------------------------------
  public DynamicRef(dynamicRef: Schema.XDynamicRef): Schema.XSchema | undefined {
    const result = Resolve.ResolveDynamicRef(this.#StackFrame(), dynamicRef)
    if (result) this.pendingResource = true
    return result
  }
  // ----------------------------------------------------------------
  // StackFrame
  //
  // Encodes the current stack state into a read-only snapshot that
  // Resolve needs to make resolution decisions. Nothing in Resolve
  // mutates this or reaches back into Stack. We currently do this to
  // decouple Stack and Resolve, but we may just pass Stack directly
  // to Resolve in future revisions (review).
  // ----------------------------------------------------------------
  #StackFrame(): Resolve.StackFrame {
    return {
      context: this.context,
      root: this.schema as Schema.XSchemaObject,
      ids: this.ids,
      lexicalSchema: this.#LexicalSchema(),
      lexicalBase: this.LexicalBaseURL(),
      referenceBase: this.#ReferenceBaseURL(),
      resourceBase: this.#ResourceBaseURL(),
      recursiveAnchors: this.recursiveAnchors,
      dynamicAnchors: this.dynamicAnchors,
      inRetrievedFrame: this.retrievedFrames.length > 0
    }
  }
  // ----------------------------------------------------------------
  // ApplyRefResult
  //
  // Updates stack state after reference resolution to reflect target
  // scope boundaries. It immediately enters new base URIs for resolved
  // $ids, flags the target as a pending resource root for upcoming
  // traversal, or maps external document roots so Push can manage
  // frame boundaries when traversal reaches them.
  // ----------------------------------------------------------------
  #ApplyRefResult(result: Resolve.RefResult): void {
    if (!Guard.IsUndefined(result.schema)) this.pendingResource = true
    if (!Guard.IsUndefined(result.resolvedResource)) {
      this.#EnterResolvedResource(
        result.resolvedResource.target,
        result.resolvedResource.resource
      )
    }
    if (!Guard.IsUndefined(result.retrievedResource)) {
      this.retrievedResources.set(result.retrievedResource.target, {
        base: result.retrievedResource.base,
        root: result.retrievedResource.root
      })
    }
  }
  // ----------------------------------------------------------------
  // BuildBase
  // ----------------------------------------------------------------
  #BuildBase(stack: Schema.XId[]): string {
    const frame = this.retrievedFrames[this.retrievedFrames.length - 1]
    const base = frame ? new URL(frame.base) : new URL(Resolve.DefaultBase)
    const scoped = frame ? stack.slice(frame.idDepth) : stack
    return scoped.reduce((result, schema) => new URL(schema.$id, result), base).href
  }
  // ----------------------------------------------------------------
  // ResourceBaseURL
  // ----------------------------------------------------------------
  #ResourceBaseURL(): string {
    const frame = this.retrievedFrames[this.retrievedFrames.length - 1]
    if (!frame) return this.#BuildBase(this.resourceIds)
    return this.resourceIds.slice(frame.resourceDepth).reduce((result, schema) => new URL(schema.$id, result), new URL(frame.base)).href
  }
  // ----------------------------------------------------------------
  // ReferenceBaseURL
  // ----------------------------------------------------------------
  #ReferenceBaseURL(): string {
    if (this.retrievedFrames.length > 0) return this.#ResourceBaseURL()
    const lexical = this.ids[this.ids.length - 1]
    if (lexical && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(lexical.$id)) return this.LexicalBaseURL()
    return this.#ResourceBaseURL()
  }
  // ----------------------------------------------------------------
  // LexicalSchema
  // ----------------------------------------------------------------
  #LexicalSchema(): Schema.XSchemaObject {
    const frame = this.retrievedFrames[this.retrievedFrames.length - 1]
    if (frame) return this.ids.length > frame.idDepth ? this.ids[this.ids.length - 1] : frame.schema
    return this.ids.length > 0 ? this.ids[this.ids.length - 1] : (this.schema as Schema.XSchemaObject)
  }
  // ----------------------------------------------------------------
  // RegisterResourceAnchorArray
  //
  // Note: Invalid $refs may land here, presumably via anchors
  // embedded in logical allOf/anyOf operands. I noted a few
  // test suite cases commented as invalid that trigger this
  // code path. We may be able to remove these in the future as,
  // technically, we shouldn't need to traverse arrays inside
  // the stack instances (review).
  // ----------------------------------------------------------------
  #RegisterResourceAnchorArray(schema: unknown[]): void {
    schema.forEach((schema) => this.#RegisterResourceAnchors(schema, false))
  }
  #UnregisterResourceAnchorArray(schema: unknown[]): void {
    schema.forEach((schema) => this.#UnregisterResourceAnchors(schema, false))
  }
  // ----------------------------------------------------------------
  // RegisterResourceAnchors
  // ----------------------------------------------------------------
  #RegisterResourceAnchors(schema: unknown, isRoot: boolean = true): void {
    if (Schema.IsSchemaBoolean(schema)) return
    if (Guard.IsArray(schema)) return this.#RegisterResourceAnchorArray(schema)
    if (!Schema.IsSchemaObject(schema)) return
    const current = schema as Record<PropertyKey, unknown>
    if (!isRoot && Schema.IsId(current)) return
    if (!isRoot && Schema.IsDynamicAnchor(current)) this.dynamicAnchors.push(current)
    for (const key of Guard.Keys(current)) this.#RegisterResourceAnchors(current[key], false)
  }
  // ----------------------------------------------------------------
  // UnregisterResourceAnchors
  // ----------------------------------------------------------------
  #UnregisterResourceAnchors(schema: unknown, isRoot: boolean = true): void {
    if (Schema.IsSchemaBoolean(schema)) return
    if (Guard.IsArray(schema)) return this.#UnregisterResourceAnchorArray(schema)
    if (!Schema.IsSchemaObject(schema)) return
    const current = schema as Record<PropertyKey, unknown>
    if (!isRoot && Schema.IsId(current)) return
    if (!isRoot && Schema.IsDynamicAnchor(current)) this.dynamicAnchors.pop()
    for (const key of Guard.Keys(current)) this.#UnregisterResourceAnchors(current[key], false)
  }
  // ----------------------------------------------------------------
  // RegisterResource
  // ----------------------------------------------------------------
  #RegisterResource(schema: Schema.XId): void {
    this.ids.push(schema)
    const isResource = this.pendingResource
    this.pendingResource = false
    if (isResource) this.resourceIds.push(schema)
    this.#RegisterResourceAnchors(schema, true)
  }
  // ----------------------------------------------------------------
  // UnregisterResource
  // ----------------------------------------------------------------
  #UnregisterResource(schema: Schema.XId): void {
    this.ids.pop()
    const isResource = this.resourceIds.length > 0 && Guard.IsEqual(this.resourceIds[this.resourceIds.length - 1], schema)
    if (isResource) this.resourceIds.pop()
    this.#UnregisterResourceAnchors(schema, true)
  }
  // ----------------------------------------------------------------
  // EnterResolvedResource
  // ----------------------------------------------------------------
  #EnterResolvedResource(target: Schema.XSchemaObject, resource: Schema.XId): void {
    this.#RegisterResource(resource)
    this.resolvedResources.set(target, resource)
  }
  // ----------------------------------------------------------------
  // ExitResolvedResource
  // ----------------------------------------------------------------
  #ExitResolvedResource(target: Schema.XSchemaObject): void {
    if (!this.resolvedResources.has(target)) return
    const resource = this.resolvedResources.get(target)!
    this.#UnregisterResource(resource)
    this.resolvedResources.delete(target)
  }
}
