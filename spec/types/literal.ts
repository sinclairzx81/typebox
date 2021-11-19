import * as Spec from './spec'
import { Type } from './typebox'

Spec.expectType<'hello'>(Spec.infer(Type.Literal('hello')))

Spec.expectType<true>(Spec.infer(Type.Literal(true)))

Spec.expectType<42>(Spec.infer(Type.Literal(42)))