import * as Spec from './spec'
import { Type } from './typebox'

Spec.expectType<any>(Spec.infer(Type.Any()))
