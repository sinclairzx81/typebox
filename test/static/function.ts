import { Expect } from './assert'
import { Type } from '@sinclair/typebox'

{
  // simple
  const T = Type.Function([Type.Number(), Type.Boolean()], Type.String())
  Expect(T).ToStatic<(param_0: number, param_1: boolean) => string>()
}
{
  // nested
  // prettier-ignore
  const T = Type.Function([Type.Number(), Type.String()], Type.Object({
    method: Type.Function([Type.Number(), Type.String()], Type.Boolean()),
  }))
  Expect(T).ToStatic<(param_0: number, param_1: string) => { method: (param_0: number, param_1: string) => boolean }>()
}
{
  // decode 2
  const S = Type.Transform(Type.Integer())
    .Decode((value) => new Date(value))
    .Encode((value) => value.getTime())
  const T = Type.Function([S], Type.String())
  Expect(T).ToStaticDecode<(param_0: Date) => string>()
}
{
  // decode 1
  const S = Type.Transform(Type.Integer())
    .Decode((value) => new Date(value))
    .Encode((value) => value.getTime())
  const T = Type.Function([Type.Number()], S)
  Expect(T).ToStaticDecode<(param_0: number) => Date>()
}
