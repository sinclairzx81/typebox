import { Static, TSchema } from '@sinclair/typebox'

export function Expect<T extends TSchema>(schema: T) {
  return {
    ToInfer: <U extends Static<T>>() => {},
    ToBe: <U extends T>() => {},
  }
}
