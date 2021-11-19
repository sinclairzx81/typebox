import * as Spec from './spec'
import { Type } from './typebox'

enum E { A, B = 'hello', C = 42 }

const T = Type.Enum(E)

Spec.expectType<E>(Spec.infer(T))