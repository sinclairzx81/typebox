import * as Types from '../typebox'
export declare namespace CreateValue {
  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  function Visit<T extends Types.TSchema>(schema: T): Types.Static<T>
  /** Creates a value from the given schema. If the schema specifies a default value, then that value is returned. */
  function Create<T extends Types.TSchema>(schema: T): Types.Static<T>
}
