import * as Spec from './spec'
import { Type } from './typebox'

Spec.expectType<unknown>(Spec.infer(Type.Unknown()))
