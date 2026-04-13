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
import Guard, { Guard as G } from '../../guard/index.ts'
import { Resolve } from '../resolve/index.ts'

export class Stack {
  private readonly ids: Schema.XId[] = []
  private readonly anchors: Schema.XAnchor[] = []
  private readonly recursiveAnchors: Schema.XRecursiveAnchor[] = []
  private readonly dynamicAnchors: Schema.XDynamicAnchor[] = []
  private readonly dynamicAnchorIndex: Map<string, Schema.XDynamicAnchor[]> = new Map()


  constructor(
    private readonly context: Record<PropertyKey, Schema.XSchema>,
    private readonly schema: Schema.XSchema
  ) {
    this.IndexDynamicAnchors(schema)
  }

  private IndexDynamicAnchors(value: unknown): void {
    if (!G.IsObject(value) || G.IsArray(value)) return
    const schema = value as Record<PropertyKey, unknown>
    if (Schema.IsSchemaObject(value) && Schema.IsDynamicAnchor(value)) {
      const anchor = value.$dynamicAnchor
      if (!this.dynamicAnchorIndex.has(anchor)) this.dynamicAnchorIndex.set(anchor, [])
      this.dynamicAnchorIndex.get(anchor)!.push(value)
    }
    for (const key of Object.keys(schema)) {
      this.IndexDynamicAnchors(schema[key])
    }
  }
  // ----------------------------------------------------------------
  // Base
  // ----------------------------------------------------------------
  public BaseURL(): URL {
    return this.ids.reduce((result, schema) => new URL(schema.$id, result), new URL('http://unknown'))
  }
  public Base(): Schema.XSchemaObject {
    return this.ids[this.ids.length - 1] ?? this.schema
  }
  // ----------------------------------------------------------------
  // Stack
  // ----------------------------------------------------------------
public Push(schema: Schema.XSchema) {
  if (!Schema.IsSchemaObject(schema)) return
  if (Schema.IsId(schema)) {
    this.ids.push(schema)
    // Push all $dynamicAnchor schemas within this resource boundary
    this.PushResourceAnchors(schema, true)
  }
  if (Schema.IsAnchor(schema)) this.anchors.push(schema)
  if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.push(schema)
  if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.push(schema)
}

public Pop(schema: Schema.XSchema) {
  if (!Schema.IsSchemaObject(schema)) return
  if (Schema.IsId(schema)) {
    this.ids.pop()
    // Pop all $dynamicAnchor schemas within this resource boundary
    this.PopResourceAnchors(schema, true)
  }
  if (Schema.IsAnchor(schema)) this.anchors.pop()
  if (Schema.IsRecursiveAnchorTrue(schema)) this.recursiveAnchors.pop()
  if (Schema.IsDynamicAnchor(schema)) this.dynamicAnchors.pop()
}

private PushResourceAnchors(value: unknown, isRoot: boolean): void {
  if (!Schema.IsSchemaObject(value)) return
  // Don't cross into nested $id boundaries (different resource)
  if (!isRoot && Schema.IsId(value)) return
  if (!isRoot && Schema.IsDynamicAnchor(value)) this.dynamicAnchors.push(value)
  for (const key of Guard.Keys(value as Record<PropertyKey, unknown>)) {
    this.PushResourceAnchors((value as Record<PropertyKey, unknown>)[key], false)
  }
}

private PopResourceAnchors(value: unknown, isRoot: boolean): void {
  if (!Schema.IsSchemaObject(value)) return
  if (!isRoot && Schema.IsId(value)) return
  if (!isRoot && Schema.IsDynamicAnchor(value)) this.dynamicAnchors.pop()
  for (const key of Guard.Keys(value as Record<PropertyKey, unknown>)) {
    this.PopResourceAnchors((value as Record<PropertyKey, unknown>)[key], false)
  }
}

public RefResourceRoot(ref: string): Schema.XSchemaObject | undefined {
  if (ref.startsWith('#')) return undefined  // same-resource ref, no boundary crossing
  const resolved = Resolve.Ref(this.schema as Schema.XSchemaObject, ref)
  if (Guard.IsUndefined(resolved)) return undefined
  // Find the $id-bearing schema that contains the resolved target
  // by resolving just the non-fragment part of the ref
  const nonFragment = ref.includes('#') ? ref.slice(0, ref.indexOf('#')) : ref
  const root = Resolve.Ref(this.schema as Schema.XSchemaObject, nonFragment)
  if (Guard.IsUndefined(root)) return undefined
  if (!Schema.IsSchemaObject(root)) return undefined
  if (!Schema.IsId(root)) return undefined
  // Only return if it's a different resource than current base
  return root !== this.Base() ? root : undefined
}
  // ----------------------------------------------------------------
  // Ref
  // ----------------------------------------------------------------
  private FromContext(ref: string): Schema.XSchema | undefined {
    return G.HasPropertyKey(this.context, ref) ? this.context[ref] : undefined
  }
  private FromRef(ref: string): Schema.XSchema | undefined {
    return !ref.startsWith('#')
      ? Resolve.Ref(this.schema as Schema.XSchemaObject, ref)
      : Resolve.Ref(this.Base(), ref)
  }
  public Ref(ref: string): Schema.XSchema | undefined {
    return this.FromContext(ref) ?? this.FromRef(ref)
  }
  // ----------------------------------------------------------------
  // RecursiveRef
  // ----------------------------------------------------------------
  public RecursiveRef(recursiveRef: string): Schema.XSchema | undefined {
    if (Schema.IsRecursiveAnchorTrue(this.Base())) {
      return Resolve.Ref(this.recursiveAnchors[0], recursiveRef)
    }
    return Resolve.Ref(this.Base(), recursiveRef)
  }
  // ----------------------------------------------------------------
  // DynamicRef
  // ----------------------------------------------------------------
public DynamicRef(dynamicRef: string): Schema.XSchema | undefined {
  const isFragmentOnly = dynamicRef.startsWith('#')
  const target = isFragmentOnly
    ? Resolve.Ref(this.Base(), dynamicRef)
    : Resolve.Ref(this.schema as Schema.XSchemaObject, dynamicRef)
  if (Guard.IsUndefined(target)) return undefined
  if (Schema.IsSchemaObject(target) && Schema.IsDynamicAnchor(target)) {
    const fragment = new URL(dynamicRef, 'http://unknown/').hash
    if (!fragment.startsWith('#/')) {
      // Search live stack first (outermost match)
      const fromStack = this.dynamicAnchors.find(s => s.$dynamicAnchor === target.$dynamicAnchor)
      if (!Guard.IsUndefined(fromStack)) return fromStack
      // Search entered resource roots for matching anchors within their boundary
      for (const id of this.ids) {
        const found = Resolve.Ref(id, `#${target.$dynamicAnchor}`)
        if (!Guard.IsUndefined(found) && Schema.IsSchemaObject(found) && Schema.IsDynamicAnchor(found)) {
          return found
        }
      }
    }
  }
  return target
}
}
