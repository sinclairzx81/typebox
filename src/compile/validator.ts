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

import { Settings } from '../system/settings/index.ts'
import { Arguments } from '../system/arguments/index.ts'
import { type TLocalizedValidationError } from '../error/index.ts'
import { type StaticDecode, type StaticEncode, type TProperties, type TSchema, Base } from '../type/index.ts'
import { Errors, Clean, Convert, Create, Default, Decode, Encode, HasCodec, Parser, ParseError } from '../value/index.ts'
import { Build, BuildResult, EvaluateResult } from '../schema/index.ts'

// ------------------------------------------------------------------
// Validator<...>
// ------------------------------------------------------------------
export class Validator<Context extends TProperties = TProperties, Type extends TSchema = TSchema, 
  Encode extends unknown = StaticEncode<Type, Context>,
  Decode extends unknown = StaticDecode<Type, Context>
> extends Base<Encode> {
  private readonly hasCodec: boolean
  private readonly buildResult: BuildResult
  private readonly evaluateResult: EvaluateResult
  /** Constructs a Validator with the given Context and Type. */
  constructor(context: Context, type: Type)
  /** Constructs a Validator with the given arguments. */
  constructor(hasCodec: boolean, buildResult: BuildResult, evaluateResult: EvaluateResult)
  /** Constructs a Validator. */
  constructor(...args: unknown[]) {
    super()
    const matched: [boolean, BuildResult, EvaluateResult] | [Context, Type] = Arguments.Match(args, {
      3: (hasCodec, buildResult, evaluateResult) => [hasCodec, buildResult, evaluateResult],
      2: (context, type) => [context, type]
    })
    // Note: The Base type requires this Validator to be Clone, but where we cannot safely clone
    // the BuildResult or the EvaluateResult. For now we need pass the Validator constructor a 
    // cloned instance of BuildResult and EvaluateResult such that the Validator clone shares 
    // the same pre-compiled fields. We should remove this overload when Base is removed.
    if(matched.length === 3 && matched[1] instanceof BuildResult && matched[2] instanceof EvaluateResult) {
      const [hasCodec, buildResult, evaluateResult] = matched
      this.hasCodec = hasCodec
      this.buildResult = buildResult
      this.evaluateResult = evaluateResult
    } else {
      const [context, type] = matched as [Context, Type]
      this.hasCodec = HasCodec(context, type)
      this.buildResult = Build(context, type)
      this.evaluateResult = this.buildResult.Evaluate()
    }
  }
  // ----------------------------------------------------------------
  // IsAccelerated
  // ----------------------------------------------------------------
  /** Returns true if this Validator is using JIT acceleration. */
  public IsAccelerated(): boolean {
    return this.evaluateResult.IsAccelerated()
  }
  // ----------------------------------------------------------------
  // Context & Type
  // ----------------------------------------------------------------
  /** Returns the Context for this validator. */
  public Context(): Context {
    return this.buildResult.Context() as never
  }
  /** Returns the underlying Type used to construct this Validator. */
  public Type(): Type {
    return this.buildResult.Schema() as never
  }
  // ----------------------------------------------------------------
  // Code
  // ----------------------------------------------------------------
  /** Returns the generated code for this validator. */
  public Code(): string {
    return this.evaluateResult.Code()
  }
  // ----------------------------------------------------------------
  // Standard Validator
  // ----------------------------------------------------------------
  /** Performs a type-guard check on the provided value. */
  public override Check(value: unknown): value is Encode {
    return this.evaluateResult.Check(value)
  }
  /** Validates a value and returns it. Will throw if invalid. */
  public Parse(value: unknown): Encode {
    const checked = this.Check(value)
    if(checked) return value as never
    if(Settings.Get().correctiveParse) return Parser(this.Context(), this.Type(), value) as never
    throw new ParseError(value, this.Errors(value))
  }
  /** Inspects a value and returns a detailed list of validation errors. */
  public override Errors(value: unknown): TLocalizedValidationError[] {
    if (this.IsAccelerated() && this.Check(value)) return []
    return Errors(this.Context(), this.Type(), value)
  }
  // ----------------------------------------------------------------
  // Value.* Operations
  // ----------------------------------------------------------------
  /** Cleans a value using the Validator type. */
  public override Clean(value: unknown): unknown {
    return Clean(this.Context(), this.Type(), value)
  }
  /** Converts a value using the Validator type. */
  public override Convert(value: unknown): unknown {
    return Convert(this.Context(), this.Type(), value)
  }
  /** Creates a value using the Validator type. */
  public override Create(): Encode {
    return Create(this.Context(), this.Type())
  }
  /** Creates defaults using the Validator type. */
  public override Default(value: unknown): unknown {
    return Default(this.Context(), this.Type(), value)
  }
  /** Decodes a value */
  public Decode(value: unknown): Decode {
    const result = this.hasCodec ? Decode(this.Context(), this.Type(), value) : this.Parse(value)
    return result as never
  }
  /** Encodes a value */
  public Encode(value: unknown): Encode {
    const result = this.hasCodec ? Encode(this.Context(), this.Type(), value) : this.Parse(value)
    return result as never
  }
  // ----------------------------------------------------------------
  // Deprecations
  // ----------------------------------------------------------------
  /** 
   * @deprecated Validator instances should not support Clone because they are owners of JIT evaluated functions. This function will be 
   * removed in the next version of TypeBox (relates to Type.Base deprecation)
   */
  public override Clone(): Validator<Context, Type> {
    return new Validator<Context, Type>(this.hasCodec, this.buildResult, this.evaluateResult)
  }
}