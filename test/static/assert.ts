import { Static, StaticDecode, StaticEncode, TSchema } from '@sinclair/typebox'

declare const unsatisfiable: unique symbol
// Warning: `never` and `any` satisfy the constraint `extends Expected<...>`
type Expected<_> = { [unsatisfiable]: never; }

type ConstrainEqual<T, U> = (
  <V>() => V extends T ? 1 : 2
) extends <V>() => V extends U ? 1 : 2
  ? T
  : Expected<T>

// See https://github.com/microsoft/TypeScript/issues/51011
type CircularHelper<T, U> = [T] extends U ? T : Expected<T>
type ConstraintMutuallyExtend<T, U> = CircularHelper<T, [U]>

type If<T, Y, N> = T extends true ? Y : N
type And<T, U> = If<T, U, false>
type Or<T, U> = If<T, true, U>
type Not<T> = If<T, false, true>

type IsAny<a> = 0 extends 1 & a ? true : false
type Extends<T, U> = [T] extends [U] ? true : false

// If U is never, there's nothing we can do
type ComplexConstraint<T, U> = If<
  // If U is any, we can't use Expect<T> or it would satisfy the constraint
  And<Not<IsAny<T>>, IsAny<U>>,
  never,
  If<
    Or<
      // If they are both any we are happy
      And<IsAny<T>, IsAny<U>>,
      // If T extends U, but not because it's any, we are happy
      And<Extends<T, U>, Not<IsAny<T>>>
    >,
    T,
    Expected<T>
  >
>

// Uncomment one of the lines to see the difference
// type Constraint<T, U> = ConstraintMutuallyExtend<T, U>
// type Constraint<T, U> = ConstrainEqual<T, U>
type Constraint<T, U> = ComplexConstraint<T, U>

export function Expect<T extends TSchema>(schema: T) {
  return {
    ToStatic: <U extends Constraint<Static<T>, U>>() => {},
    ToStaticDecode: <U extends Constraint<StaticDecode<T>, U>>() => {},
    ToStaticEncode: <U extends Constraint<StaticEncode<T>, U>>() => {},
  }
}
