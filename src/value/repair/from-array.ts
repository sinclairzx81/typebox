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

import type { TProperties, TArray } from '../../type/index.ts'
import { IsMaxItems, IsMinItems, IsUniqueItems } from '../../schema/types/index.ts'

import { Guard } from '../../guard/index.ts'
import { Check } from '../check/index.ts'
import { Create } from '../create/index.ts'
import { Hash } from '../hash/index.ts'

import { FromType } from './from-type.ts'
import { RepairError } from './error.ts'

// ------------------------------------------------------------------
// MakeUnique
// ------------------------------------------------------------------
function MakeUnique(values: unknown[]) {
  const [hashes, result] = [new Set(), []] as [Set<string>, unknown[]]
  for(const value of values) {
    const hash = Hash(value)
    if(hashes.has(hash)) continue
    hashes.add(hash)
    result.push(value)
  }
  return result
}

// ------------------------------------------------------------------
// FromArray
// ------------------------------------------------------------------
export function FromArray(context: TProperties, type: TArray, value: unknown): unknown {
  if (Check(context, type, value)) return value
  const created = Guard.IsArray(value) ? value : Create(context, type)
  const minimum = IsMinItems(type) && created.length < type.minItems ? [...created, ...Array.from({ length: type.minItems - created.length }, () => Create(context, type))] : created
  const maximum = IsMaxItems(type) && minimum.length > type.maxItems ? minimum.slice(0, type.maxItems) : minimum
  const repaired = maximum.map((value: unknown) => FromType(context, type.items, value))
  if(!IsUniqueItems(type) || (IsUniqueItems(type) && !Guard.IsEqual(type.uniqueItems, true))) return repaired
  const unique = MakeUnique(repaired)
  if (!Check(context, type, unique)) throw new RepairError(context, type, value, 'Failed to repair Array due to uniqueItems constraint')
  return unique
}