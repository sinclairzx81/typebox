/*--------------------------------------------------------------------------

@sinclair/typebox/type

The MIT License (MIT)

Copyright (c) 2017-2024 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

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

import { CreateType } from '../create/index'
import { Kind } from '../symbols/index'
import { SchemaOptions, TSchema } from '../schema/index'
import { TProperties } from '../object/index'
import { Static } from '../static/index'

// ------------------------------------------------------------------
// Module Infrastructure Types
// ------------------------------------------------------------------
import { ComputeModuleProperties, TComputeModuleProperties } from './compute'
import { TInferFromModuleKey } from './infer'

// ------------------------------------------------------------------
// Definitions
// ------------------------------------------------------------------
export interface TDefinitions<ModuleProperties extends TProperties> extends TSchema {
  static: { [K in keyof ModuleProperties]: Static<ModuleProperties[K]> }
  $defs: ModuleProperties
}
// ------------------------------------------------------------------
// Import
// ------------------------------------------------------------------
// prettier-ignore
export interface TImport<ModuleProperties extends TProperties = {}, Key extends keyof ModuleProperties = keyof ModuleProperties> extends TSchema {
  [Kind]: 'Import'
  static: TInferFromModuleKey<ModuleProperties, Key>
  $defs: ModuleProperties
  $ref: Key
}
// ------------------------------------------------------------------
// Module
// ------------------------------------------------------------------
// prettier-ignore
export class TModule<ModuleProperties extends TProperties, ComputedModuleProperties extends TProperties = TComputeModuleProperties<ModuleProperties>> {
  private readonly $defs: ComputedModuleProperties
  constructor($defs: ModuleProperties) {
    const computed = ComputeModuleProperties($defs)
    const identified = this.WithIdentifiers(computed as never)
    this.$defs = identified as never
  }
  /** `[Json]` Imports a Type by Key. */
  public Import<Key extends keyof ComputedModuleProperties>(key: Key, options?: SchemaOptions): TImport<ComputedModuleProperties, Key> {
    const $defs = { ...this.$defs, [key]: CreateType(this.$defs[key], options) }
    return CreateType({ [Kind]: 'Import', $defs, $ref: key }) as never
  }
  // prettier-ignore
  private WithIdentifiers($defs: ComputedModuleProperties): ComputedModuleProperties {
    return globalThis.Object.getOwnPropertyNames($defs).reduce((result, key) => {
      return  { ...result, [key]: { ...$defs[key], $id: key }}
    }, {}) as never
  }
}
/** `[Json]` Creates a Type Definition Module. */
export function Module<Properties extends TProperties>(properties: Properties): TModule<Properties> {
  return new TModule(properties)
}
