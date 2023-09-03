import { Static, StaticDecode, StaticEncode, TSchema } from '@sinclair/typebox'

// ------------------------------------------------------------------
// Unsatisfiable
// ------------------------------------------------------------------
declare const Unsatisfiable: unique symbol
// Warning: `never` and `any` satisfy the constraint `extends Expected<...>`
export type Expected<_> = { [Unsatisfiable]: never }

// ------------------------------------------------------------------
// Constraints
// ------------------------------------------------------------------
// See https://github.com/Microsoft/TypeScript/issues/27024
// prettier-ignore
export type ConstrainEqual<T, U> = (
  <V>() => V extends T ? 1 : 2
) extends <V>() => V extends U ? 1 : 2
  ? T
  : Expected<T>

// See https://github.com/microsoft/TypeScript/issues/51011
export type CircularHelper<T, U> = [T] extends U ? T : Expected<T>
export type ConstraintMutuallyExtend<T, U> = CircularHelper<T, [U]>

export type If<T, Y, N> = T extends true ? Y : N
export type And<T, U> = If<T, U, false>
export type Or<T, U> = If<T, true, U>
export type Not<T> = If<T, false, true>

export type Extends<T, U> = [T] extends [U] ? true : false
export type IsAny<T> = 0 extends 1 & T ? true : false
export type IsNever<T> = Extends<T, never>

// If U is never, there's nothing we can do
export type ComplexConstraint<T, U> = If<
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
export type Constraint<T, U> = ComplexConstraint<T, U>

// ------------------------------------------------------------------
// Expect
// ------------------------------------------------------------------
export type ExpectResult<T extends TSchema> = If<
  IsNever<Static<T>>,
  { ToStaticNever(): void },
  {
    ToStatic<U extends Constraint<Static<T>, U>>(): void
    ToStaticDecode<U extends Constraint<StaticDecode<T>, U>>(): void
    ToStaticEncode<U extends Constraint<StaticEncode<T>, U>>(): void
  }
>
export function Expect<T extends TSchema>(schema: T) {
  return {
    ToStatic() {},
    ToStaticNever() {},
    ToStaticDecode() {},
    ToStaticEncode() {},
  } as ExpectResult<T>
}
