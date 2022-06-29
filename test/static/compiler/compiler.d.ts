import * as Types from '../typebox'
export declare type CheckFunction = (value: unknown) => CheckOk | CheckFail
export interface CheckOk {
  ok: true
}
export interface CheckFail {
  ok: false
}
export declare class TypeCheckAssertError extends Error {
  readonly schema: Types.TSchema
  readonly value: unknown
  constructor(schema: Types.TSchema, value: unknown)
}
export declare class TypeCheck<T extends Types.TSchema> {
  private readonly schema
  private readonly checkFunc
  constructor(schema: T, checkFunc: CheckFunction)
  /** Returns true if the value is valid. */
  Check(value: unknown): value is Types.Static<T>
  /** Asserts the given value and throws a TypeCheckAssertError if invalid. */
  Assert(value: unknown): asserts value
}
export declare namespace TypeCompiler {
  interface Condition {
    schema: Types.TSchema
    expr: string
    path: string
  }
  /** Compiles a type into validation function */
  function Compile<T extends Types.TSchema>(schema: T, additional?: Types.TSchema[]): TypeCheck<T>
}
