import * as Types from '../typebox'
import { Edit } from './delta'
export { Edit, EditType } from './delta'
export declare namespace Value {
  /** Returns true if the value conforms to the given schema */
  function Check<T extends Types.TSchema>(schema: T, value: any): value is Types.Static<T>
  /** Returns a deep clone of the given value */
  function Clone<T>(value: T): T
  /** Creates a value from the given schema type */
  function Create<T extends Types.TSchema>(schema: T): Types.Static<T>
  /** Diffs the value and produces edits to transform the value into the next value */
  function Diff(value: any, next: any): Edit[]
  /** Patches a value by applying a series of edits */
  function Patch(value: any, edits: Edit[]): any
  /** Upcasts a value to match a schema while preserving as much information from the original value as possible. */
  function Upcast<T extends Types.TSchema>(schema: T, value: any): Types.Static<T>
}
