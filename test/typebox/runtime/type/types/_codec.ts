import { Assert } from 'test'
import { Guard } from 'typebox/guard'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Codec')

// ------------------------------------------------------------------
// Invariant
// ------------------------------------------------------------------
Test('Should Codec 1', () => {
  const T: Type.TString = Type.String()
  Assert.IsFalse(Type.IsCodec(T))
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Codec 2', () => {
  const T: Type.TCodec<Type.TString, string> = Type.Codec(Type.String())
    .Decode((value) => value)
    .Encode((value) => value)
  Assert.IsTrue(Type.IsCodec(T))
  Assert.IsTrue(Type.IsString(T))
})
// ------------------------------------------------------------------
// Bidirectional
// ------------------------------------------------------------------
Test('Should Codec 3', () => {
  const T: Type.TCodec<Type.TString, number> = Type.Codec(Type.String())
    .Decode((value) => parseInt(value))
    .Encode((value) => value.toString())
  Assert.IsTrue(Type.IsCodec(T))
  Assert.IsTrue(Type.IsString(T))
})
// ------------------------------------------------------------------
// Unidirectional
// ------------------------------------------------------------------
Test('Should Codec 4', () => {
  const T: Type.TCodec<Type.TString, number> = Type.Decode(Type.String(), (value) => parseInt(value))
  Assert.IsTrue(Type.IsCodec(T))
  Assert.IsTrue(Type.IsString(T))
})
Test('Should Codec 5', () => {
  const T: Type.TCodec<Type.TString, unknown> = Type.Encode(Type.String(), (value) => {
    return Guard.IsNumber(value) ? value.toString() : '0'
  })
  Assert.IsTrue(Type.IsCodec(T))
  Assert.IsTrue(Type.IsString(T))
})
