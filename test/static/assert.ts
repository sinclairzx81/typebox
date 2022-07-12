import { Static, TSchema } from '@sinclair/typebox'

export function Expect<T extends TSchema>(schema: T) {
  return {
    ToBe: <U extends Static<T>>() => {},
  }
}
