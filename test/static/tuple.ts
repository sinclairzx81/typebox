import * as Spec from './spec'
import { Type } from './typebox'

{
  const T = Type.Tuple([Type.Number(), Type.String(), Type.Boolean()])

  Spec.expectType<[number, string, boolean]>(Spec.infer(T))
}
