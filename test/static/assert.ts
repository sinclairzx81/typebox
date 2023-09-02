import { Static, StaticDecode, StaticEncode, TSchema } from '@sinclair/typebox'

declare const unsatisfiable: unique symbol
type Expected<_> = { [unsatisfiable]: never; }

type ConstrainEqual<T, U> = (
  <V>() => V extends T ? 1 : 2
) extends <V>() => V extends U ? 1 : 2
  ? T
  : Expected<T>

// See https://github.com/microsoft/TypeScript/issues/51011
type CircularHelper<T, U> = [T] extends U ? T : Expected<T>
type ConstraintMutuallyExtend<T, U> = CircularHelper<T, [U]>

// Comment one or the other to see the difference
// type Constraint<T, U> = ConstraintMutuallyExtend<T, U>
type Constraint<T, U> = ConstrainEqual<T, U>

export function Expect<T extends TSchema>(schema: T) {
  return {
    ToStatic: <U extends Constraint<Static<T>, U>>() => {},
    ToStaticDecode: <U extends Constraint<StaticDecode<T>, U>>() => {},
    ToStaticEncode: <U extends Constraint<StaticEncode<T>, U>>() => {},
  }
}
