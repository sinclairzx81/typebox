import * as Spec from './spec'
import { Type } from './typebox'

Spec.expectType<number>(Spec.infer(Type.Number()))

