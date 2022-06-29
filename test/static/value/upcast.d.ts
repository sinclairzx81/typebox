import * as Types from '../typebox'
export declare namespace UpcastValue {
  function Create<T extends Types.TSchema>(schema: T, value: any): Types.Static<T>
}
