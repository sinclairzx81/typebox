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
import { type TSchema, type TSchemaOptions, IsSchema } from '../types/schema.ts'
import { type TProperties } from '../types/properties.ts'
import { type TDeferred, Deferred } from '../types/deferred.ts'
import { type TInstantiate, Instantiate } from '../engine/instantiate.ts'

// ------------------------------------------------------------------
// Deferred
// ------------------------------------------------------------------
/** Creates a deferred Interface action. */
export type TInterfaceDeferred<Heritage extends TSchema[] = TSchema[], Properties extends TProperties = TProperties> = (
  TDeferred<'Interface', [Heritage, Properties]>
)
/** Creates a deferred Interface action. */
export function InterfaceDeferred<Heritage extends TSchema[], Properties extends TProperties>
  (heritage: [...Heritage], properties: Properties, options: TSchemaOptions = {}): 
    TInterfaceDeferred<Heritage, Properties> {
  return Deferred('Interface', [heritage, properties], options) as never
}
/** Returns true if this value is a deferred Interface action. */
export function IsInterfaceDeferred(value: unknown): value is TInterfaceDeferred {
  return IsSchema(value) 
    && Guard.HasPropertyKey(value, 'action')
    && Guard.IsEqual(value.action, 'Interface')
}
// ------------------------------------------------------------------
// Factory
// ------------------------------------------------------------------
/** Creates an Interface using the given heritage and properties. */
export type TInterface<Heritage extends TSchema[], Properties extends TProperties> = (
  TInstantiate<{}, TInterfaceDeferred<Heritage, Properties>>
)
/** Creates an Interface using the given heritage and properties. */
export function Interface<Heritage extends TSchema[], Properties extends TProperties>
  (heritage: [...Heritage], properties: Properties, options: TSchemaOptions = {}): 
    TInterface<Heritage, Properties> {
  return Instantiate({}, InterfaceDeferred(heritage, properties, options)) as never
}