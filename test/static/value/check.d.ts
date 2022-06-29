import * as Types from '../typebox'
export declare namespace CheckValue {
  function Visit<T extends Types.TSchema>(schema: T, value: any): boolean
  function Check<T extends Types.TSchema>(schema: T, value: any): boolean
}
