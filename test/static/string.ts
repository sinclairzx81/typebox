import * as Spec from './spec'
import { Type } from './typebox'

Spec.expectType<string>(Spec.infer(Type.String()))
