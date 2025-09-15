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

import { Environment } from '../system/environment/index.ts'
import { type TLocalizedValidationError } from '../error/index.ts'
import { type StaticDecode, type StaticEncode, type TProperties, type TSchema, Base } from '../type/index.ts'
import { Errors, Clean, Convert, Create, Default, Decode, Encode, HasCodec, Parser } from '../value/index.ts'
import { Build } from '../schema/index.ts'

// ------------------------------------------------------------------
// ValidatorType<...>
// ------------------------------------------------------------------
export class Validator<Context extends TProperties = TProperties, Type extends TSchema = TSchema> extends Base<StaticEncode<Type, Context>> {
  private readonly isEvaluated: boolean
  private readonly hasCodec: boolean
  private readonly code: string
  private readonly check: (value: unknown) => boolean
  constructor(
    private readonly context: Context,
    private readonly type: Type,
  ) {
    super()
    const result = Build(context, type).Evaluate()
    this.hasCodec = HasCodec(context, type)
    this.isEvaluated = result.IsEvaluated
    this.code = result.Code
    this.check = result.Check as never
  }
  // ----------------------------------------------------------------
  // Evaluated
  // ----------------------------------------------------------------
  /** Returns true if this validator is using runtime eval optimizations */
  public IsEvaluated(): boolean {
    return this.isEvaluated
  }
  // ----------------------------------------------------------------
  // Schema
  // ----------------------------------------------------------------
  /** Returns the Context for this validator */
  public Context(): Context {
    return this.context
  }
  /** Returns the Type for this validator */
  public Type(): Type {
    return this.type
  }
  // ----------------------------------------------------------------
  // Code
  // ----------------------------------------------------------------
  /** Returns the generated code for this validator */
  public Code(): string {
    return this.code
  }
  // ----------------------------------------------------------------
  // Base<...>
  // ----------------------------------------------------------------
  /** Checks a value matches the Validator type. */
  public override Check(value: unknown): value is StaticEncode<Type, Context> {
    return this.check(value)
  }
  /** Returns errors for the given value. */
  public override Errors(value: unknown): TLocalizedValidationError[] {
    if (Environment.CanEvaluate() && this.check(value)) return []
    return Errors(this.context, this.type, value)
  }
  /** Cleans a value using the Validator type. */
  public override Clean(value: unknown): unknown {
    return Clean(this.context, this.type, value)
  }
  /** Converts a value using the Validator type. */
  public override Convert(value: unknown): unknown {
    return Convert(this.context, this.type, value)
  }
  /** Creates a value using the Validator type. */
  public override Create(): StaticEncode<Type, Context> {
    return Create(this.context, this.type)
  }
  /** Creates defaults using the Validator type. */
  public override Default(value: unknown): unknown {
    return Default(this.context, this.type, value)
  }
  // ----------------------------------------------------------------
  // Parse | Decode | Encode
  // ----------------------------------------------------------------
  /** Parses a value */
  public Parse(value: unknown): StaticDecode<Type, Context> {
    const result = this.Check(value) ? value : Parser(this.context, this.type, value)
    return result as never
  }
  /** Decodes a value */
  public Decode(value: unknown): StaticDecode<Type, Context> {
    const result = this.hasCodec ? Decode(this.context, this.type, value) : this.Parse(value)
    return result as never
  }
  /** Encodes a value */
  public Encode(value: unknown): StaticEncode<Type, Context> {
    const result = this.hasCodec ? Encode(this.context, this.type, value) : this.Parse(value)
    return result as never
  }
}