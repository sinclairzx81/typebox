import * as Spec from './spec'
import { Type } from './typebox'

enum E { A = 'A', B = 'B', C = 'C' }

const T = Type.StringEnum(E)

Spec.expectType<E>(Spec.infer(T))