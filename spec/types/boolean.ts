import * as Spec from './spec'
import { Type } from './typebox'

Spec.expectType<boolean>(Spec.infer(Type.Boolean()))
