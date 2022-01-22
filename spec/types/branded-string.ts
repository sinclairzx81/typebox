import * as Spec from './spec'
import { Brand, Type } from './typebox'

type Email = Brand<string, 'Email'>
type WrongEmail = Brand<string, 'WrongEmail'>

// For branded types we require to pass extra constraints, otherwise it would
// make no sense to use them at all.
Spec.expectType<Email>(Spec.infer(Type.BrandedString<Email>({ format: 'email' })))

// We validate that brands clearly distinguish between different types.
Spec.expectNotType<Email>(Spec.infer(Type.BrandedString<WrongEmail>({ format: 'email' })))
Spec.expectNotType<Email>(Spec.infer(Type.String()))
