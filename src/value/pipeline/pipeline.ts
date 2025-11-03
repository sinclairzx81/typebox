/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson 

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

import { Arguments } from '../../system/arguments/index.ts'
import { type TProperties, type TSchema } from '../../type/index.ts'

import { Assert } from '../assert/index.ts'
import { Clean } from '../clean/index.ts'
import { Clone } from '../clone/index.ts'
import { Convert } from '../convert/index.ts'
import { Create } from '../create/index.ts'
import { Decode, Encode } from '../codec/index.ts'
import { Default } from '../default/index.ts'
import { Parse } from '../parse/index.ts'
import { Repair } from '../repair/index.ts'

// ------------------------------------------------------------------
// PipelineFunction
// ------------------------------------------------------------------
export interface TPipelineFunction {
  (context: TProperties, schema: TSchema, value: unknown): unknown
}
// ------------------------------------------------------------------
// PipelineInterface
// ------------------------------------------------------------------
export interface TPipelineInterface {
  (context: TProperties, schema: TSchema, value: unknown): unknown
  (schema: TSchema, value: unknown): unknown
}
/** Creates a value processing pipeline. */
function PipelineInterface(pipeline: TPipelineFunction[]): TPipelineInterface {
  return (...args: unknown[]): unknown => {
    const [context, type, value] = Arguments.Match<[TProperties, TSchema, unknown]>(args, {
      3: (context, type, value) => [context, type, value],
      2: (type, value) => [{}, type, value],
    })
    return pipeline.reduce((result, func) => func(context, type, result), value)
  }
}
// ------------------------------------------------------------------
// Build-In: Functions
// ------------------------------------------------------------------
const AssertFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => { Assert(context, type, value); return value }
const CleanFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Clean(context, type, value)
const CloneFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Clone(value)
const ConvertFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Convert(context, type, value)
const CreateFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Create(context, type)
const DecodeFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Decode(context, type, value)
const DefaultFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Default(context, type, value)
const EncodeFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Encode(context, type, value)
const ParseFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Parse(context, type, value)
const RepairFunction: TPipelineFunction = (context: TProperties, type: TSchema, value: unknown) => Repair(context, type, value)

export class PipelineBuilder {
  constructor(private readonly functions: TPipelineFunction[]) { }
  // ----------------------------------------------------------------
  // Build
  // ----------------------------------------------------------------
  public Build(): TPipelineInterface {
    return PipelineInterface(this.functions)
  }
  // ----------------------------------------------------------------
  // Use
  // ----------------------------------------------------------------
  public Use(middleware: TPipelineFunction): PipelineBuilder {
    return new PipelineBuilder([...this.functions, middleware])
  }
  // ----------------------------------------------------------------
  // Functions
  // ----------------------------------------------------------------
  /** Appends an Assert operation to this Pipeline */
  public Assert(): PipelineBuilder {
    return this.Use(AssertFunction)
  }
  /** Appends an Clean operation to this Pipeline */
  public Clean(): PipelineBuilder {
    return this.Use(CleanFunction)
  }
  /** Appends an Clone operation to this Pipeline */
  public Clone(): PipelineBuilder {
    return this.Use(CloneFunction)
  }
  /** Appends an Convert operation to this Pipeline */
  public Convert(): PipelineBuilder {
    return this.Use(ConvertFunction)
  }
  /** Appends an Create operation to this Pipeline */
  public Create(): PipelineBuilder {
    return this.Use(CreateFunction)
  }
  /** Appends an Decode operation to this Pipeline */
  public Decode(): PipelineBuilder {
    return this.Use(DecodeFunction)
  }
  /** Appends an Default operation to this Pipeline */
  public Default(): PipelineBuilder {
    return this.Use(DefaultFunction)
  }
  /** Appends an Encode operation to this Pipeline */
  public Encode(): PipelineBuilder {
    return this.Use(EncodeFunction)
  }
  /** Appends an Parse operation to this Pipeline */
  public Parse(): PipelineBuilder {
    return this.Use(ParseFunction)
  }
  /** Appends an Repair operation to this Pipeline */
  public Repair(): PipelineBuilder {
    return this.Use(RepairFunction)
  }
}
/** Creates a Pipeline of Value processing functions */
export function Pipeline(): PipelineBuilder {
  return new PipelineBuilder([])
}