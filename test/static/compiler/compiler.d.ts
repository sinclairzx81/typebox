import { ValueError } from '../value/errors'
import * as Types from '../typebox'
export declare type CheckFunction = (value: unknown) => boolean
export declare class TypeCheck<T extends Types.TSchema> {
  private readonly schema
  private readonly references
  private readonly checkFunc
  private readonly code
  constructor(schema: T, references: Types.TSchema[], checkFunc: CheckFunction, code: string)
  /** Returns the generated validation code used to validate this type. */
  Code(): string
  /** Returns an iterator for each error in this value. */
  Errors(value: unknown): IterableIterator<ValueError>
  /** Returns true if the value matches the given type. */
  Check(value: unknown): value is Types.Static<T>
}
/** Compiles TypeBox Types for Runtime Type Checking */
export declare namespace TypeCompiler {
  /** Compiles the given type for runtime type checking. This compiler only accepts known TypeBox types non-inclusive of unsafe types. */
  function Compile<T extends Types.TSchema>(schema: T, references?: Types.TSchema[]): TypeCheck<T>
}
