import { Compile } from 'typebox/compile'
import { Type } from 'typebox'
import { Fail, Ok } from './_validate.ts'
import { Assert } from 'test'

// ------------------------------------------------------------------
// These tests check Validator as a valid Base type, which includes
// a Validator's ability to be cloned.
// ------------------------------------------------------------------
const Test = Assert.Context('Value.Check.Validator')

// ------------------------------------------------------------------
// Basic
// ------------------------------------------------------------------
Test('Should validate Validator 1', () => {
  const T = Compile(Type.String())
  Ok(T, 'hello')
})
Test('Should validate Validator 2', () => {
  const T = Compile(Type.String())
  Fail(T, 1234)
})
// ------------------------------------------------------------------
// Basic
// ------------------------------------------------------------------
Test('Should validate Validator 2', () => {
  const T = Compile(Type.String()).Clone()
  Ok(T, 'hello')
})
Test('Should validate Validator 3', () => {
  const T = Compile(Type.String()).Clone()
  Fail(T, 1234)
})
// ------------------------------------------------------------------
// Basic
// ------------------------------------------------------------------
Test('Should validate Validator 4', () => {
  const T = Type.Object({
    value: Compile(Type.String())
  })
  Ok(T, { value: 'hello' })
})
Test('Should validate Validator 5', () => {
  const T = Type.Object({
    value: Compile(Type.String())
  })
  Fail(T, { value: 1234 })
})
Test('Should validate Validator 6', () => {
  const T = Type.Object({
    value: Compile(Type.String()).Clone()
  })
  Ok(T, { value: 'hello' })
})
Test('Should validate Validator 7', () => {
  const T = Type.Object({
    value: Compile(Type.String()).Clone()
  })
  Fail(T, { value: 1234 })
})
// ------------------------------------------------------------------
// Clone Check
// ------------------------------------------------------------------
Test('Should validate Validator 8', () => {
  const A = Compile(Type.String())
  const B = A.Clone()
  Assert.IsEqual(A.Code(), B.Code())
  Assert.IsEqual(A.Type(), B.Type())
  Assert.IsEqual(A.Context(), B.Context())
  Assert.IsEqual(A.IsEvaluated(), B.IsEvaluated())
  // check function cannot be cloned so we expect references to be equal
  Assert.IsTrue((A as any).check === (B as any).check)
})
// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
Test('Should validate Validator 9', () => {
  const T = Type.Object({
    value: Compile(Type.String())
  })
  const P = Type.Partial(T)
  Ok(T, { value: 'hello' })
  Fail(T, {})
  Ok(P, { value: 'hello' })
  Ok(P, {})
})
Test('Should validate Validator 10', () => {
  const T = Type.Object({
    value: Compile(Type.String()).Clone()
  })
  const P = Type.Partial(T)
  Ok(T, { value: 'hello' })
  Fail(T, {})
  Ok(P, { value: 'hello' })
  Ok(P, {})
})
// ------------------------------------------------------------------
// Non-Mutable (Clone)
// ------------------------------------------------------------------
Test('Should validate Validator 11', () => {
  const A = Type.Object({
    value: Compile(Type.String())
  })
  const B = Type.Partial(A)
  Assert.IsFalse(Type.IsOptional(A.properties.value))
  Assert.IsTrue(Type.IsOptional(B.properties.value))
})
