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

// deno-lint-ignore-file no-explicit-any
// deno-fmt-ignore-file

import { Guard } from '../../guard/index.ts'
import { ValueArguments } from '../shared/value-arguments.ts'
import { type TProperties, type TSchema } from '../../type/index.ts'

import { Clone } from '../clone/index.ts'
import { Hash } from '../hash/index.ts'

// ------------------------------------------------------------------
// PipelineInterface
// ------------------------------------------------------------------
export type PipelineFunction =
  (context: TProperties, schema: TSchema, value: unknown) => any

export interface PipelineInterface {
  (schema: TSchema, value: unknown): any
  (context: TProperties, schema: TSchema, value: unknown): any
}
// ------------------------------------------------------------------
// Pipeline
// ------------------------------------------------------------------
/** Creates a value processing pipeline. */
export function Pipeline(...pipeline: PipelineFunction[]): PipelineInterface {
  return (...args: unknown[]): any => {
    const [context, type, value] = ValueArguments(args)
    return pipeline.reduce((value, func) => {
      return (
        Guard.IsEqual(func, Clone) ? Clone(value) :
        Guard.IsEqual(func, Hash) ? Hash(value) :
        func(context, type, value)
      )
    }, value)
  }
}