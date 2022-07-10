import * as Types from '../typebox'
export declare enum StructuralResult {
  Union = 0,
  True = 1,
  False = 2,
}
/** Experimental: Does effort structural check on TypeBox types. */
export declare namespace Structural {
  function RecordValue<T extends Types.TRecord>(schema: T): Types.TSchema
  function RecordKey<T extends Types.TRecord>(schema: T): Types.TNumber | Types.TString | Types.TUnion<(Types.TLiteral<string> | Types.TLiteral<number>)[]>
  /** Returns StructuralResult.True if the left schema structurally extends the right schema. */
  function Check<Left extends Types.TAnySchema, Right extends Types.TAnySchema>(left: Left, right: Right): StructuralResult
}
export interface TExclude<T extends Types.TUnion, U extends Types.TUnion> extends Types.TUnion {
  static: Exclude<Types.Static<T, this['params']>, Types.Static<U, this['params']>>
}
export interface TExtract<T extends Types.TSchema, U extends Types.TUnion> extends Types.TUnion {
  static: Extract<Types.Static<T, this['params']>, Types.Static<U, this['params']>>
}
export declare type TExtends<T extends Types.TSchema, U extends Types.TSchema, X extends Types.TSchema, Y extends Types.TSchema> = T extends Types.TAny
  ? U extends Types.TUnknown
    ? X
    : U extends Types.TAny
    ? X
    : Types.TUnion<[X, Y]>
  : T extends U
  ? X
  : Y
/** Provides conditional mapping support for TypeBox types. */
export declare namespace Conditional {
  /** Constructs a type by excluding from UnionType all union members that are assignable to ExcludedMembers */
  function Exclude<T extends Types.TUnion, U extends Types.TUnion>(unionType: T, excludedMembers: U, options?: Types.SchemaOptions): TExclude<T, U>
  /** Constructs a type by extracting from Type all union members that are assignable to Union. */
  function Extract<T extends Types.TSchema, U extends Types.TUnion>(type: T, union: U, options?: Types.SchemaOptions): TExtract<T, U>
  /** If left extends right, return True otherwise False */
  function Extends<Left extends Types.TSchema, Right extends Types.TSchema, True extends Types.TSchema, False extends Types.TSchema>(left: Left, right: Right, x: True, y: False): TExtends<Left, Right, True, False>
}
