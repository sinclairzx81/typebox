import * as Spec from './spec'
import { Type } from './typebox'

Spec.expectType<null>(Spec.infer(Type.Null()))
