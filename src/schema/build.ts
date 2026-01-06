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
// deno-lint-ignore-file

import { Arguments } from '../system/arguments/index.ts'
import { Environment } from '../system/environment/index.ts'
import { Hashing } from '../system/hashing/index.ts'
import { Guard } from '../guard/index.ts'
import { Format } from '../format/index.ts'

import * as Engine from './engine/index.ts'
import * as Schema from './types/index.ts'

// ------------------------------------------------------------------
// CreateCode
// ------------------------------------------------------------------
function CreateCode(build: BuildResult): string {
  const functions = build.Functions().join(';\n')
  const statements = build.UseUnevaluated()
    ? ['const context = new CheckContext({}, {})', `return ${build.Call()}`]
    : [`return ${build.Call()}`]
  return `${functions}; return (value) => { ${statements.join('; ')} }`
}
// ------------------------------------------------------------------
// CreateEvaluatedCheck
// ------------------------------------------------------------------
function CreateEvaluatedCheck(build: BuildResult, code: string): CheckFunction {
  const factory = new globalThis.Function('CheckContext', 'Guard', 'Format', 'Hashing', build.External().identifier, code)
  return factory(Engine.CheckContext, Guard, Format, Hashing, build.External().variables)
}
// ------------------------------------------------------------------
// CreateDynamicCheck
// ------------------------------------------------------------------
function CreateDynamicCheck(build: BuildResult): CheckFunction {
  const stack = new Engine.Stack(build.Context(), build.Schema())
  const context = new Engine.CheckContext()
  return (value: unknown) => Engine.CheckSchema(stack, context, build.Schema(), value)
}
// ------------------------------------------------------------------
// CreateCheck
// ------------------------------------------------------------------
function CreateCheck(build: BuildResult, code: string): CheckFunction {
  return Environment.CanEvaluate()
    ? CreateEvaluatedCheck(build, code)
    : CreateDynamicCheck(build)
}
// ------------------------------------------------------------------
// CheckFunction
// ------------------------------------------------------------------
export type CheckFunction = (value: unknown) => boolean

// ------------------------------------------------------------------
// EvaluateResult
// ------------------------------------------------------------------
export interface EvaluateResult {
  IsEvaluated: boolean
  Code: string
  Check: CheckFunction
}
// ------------------------------------------------------------------
// BuildResult
// ------------------------------------------------------------------
export class BuildResult {
  constructor(
    private readonly context: Record<PropertyKey, Schema.XSchema>,
    private readonly schema: Schema.XSchema,
    private readonly external: Engine.TExternal,
    private readonly functions: string[],
    private readonly call: string,
    private readonly useUnevaluated: boolean
  ) { }
  /** Returns the Context used for this build */
  public Context(): Record<PropertyKey, Schema.XSchema> {
    return this.context
  }
  /** Returns the Schema used for this build */
  public Schema(): Schema.XSchema {
    return this.schema
  }
  /** Returns true if this build requires a Unevaluated context */
  public UseUnevaluated(): boolean {
    return this.useUnevaluated
  }
  /** Returns external variables */
  public External(): Engine.TExternal {
    return this.external
  }
  /** Returns check functions */
  public Functions(): string[] {
    return this.functions
  }
  /** Return entry function call. */
  public Call(): string {
    return this.call
  }
  /** Evaluates the build into a validation function */
  public Evaluate(): EvaluateResult {
    const Code = CreateCode(this)
    const Check = CreateCheck(this, Code)
    return { IsEvaluated: Environment.CanEvaluate(), Code, Check }
  }
}
// ------------------------------------------------------------------
// Build
// ------------------------------------------------------------------
/** Builds a schema into a optimized runtime validator */
export function Build(schema: Schema.XSchema): BuildResult
/** Builds a schema into a optimized runtime validator */
export function Build(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema): BuildResult
/** Builds a schema into a optimized runtime validator */
export function Build(...args: unknown[]): BuildResult {
  const [context, schema] = Arguments.Match<[Record<PropertyKey, Schema.XSchema>, Schema.XSchema]>(args, {
    2: (context, schema) => [context, schema],
    1: (schema) => [{}, schema]
  })
  Engine.ResetExternal()
  Engine.ResetFunctions()
  const stack = new Engine.Stack(context, schema)
  const build = new Engine.BuildContext(Engine.HasUnevaluated(context, schema))
  const call = Engine.CreateFunction(stack, build, schema, 'value')
  const functions = Engine.GetFunctions()
  const externals = Engine.GetExternal()
  return new BuildResult(context, schema, externals, functions, call, build.UseUnevaluated())
}