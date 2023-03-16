import { Static, TSchema } from '@sinclair/typebox'

export function Expect<T extends TSchema, S = Static<T>>(schema: T) {
  return {
    ToInfer: <U extends S>() => {},
    ToBe: <U extends S>() => {},
  }
}
