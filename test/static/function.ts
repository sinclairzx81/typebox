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
  // readonly-optional
  const T = Type.Function([Type.ReadonlyOptional(Type.Array(Type.Number()))], Type.Number())
  Expect(T).ToStaticDecode<(param_0?: readonly number[]) => number>()
}
{
  // readonly
  const T = Type.Function([Type.Readonly(Type.Array(Type.Number()))], Type.Number())
  Expect(T).ToStaticDecode<(param_0: readonly number[]) => number>()
}
{
  // optional 1
  const T = Type.Function([Type.Optional(Type.Number())], Type.Number())
  Expect(T).ToStaticDecode<(param_0?: number) => number>()
}
{
  // optional 2
  const T = Type.Function([Type.Number(), Type.Optional(Type.Number())], Type.Number())
  Expect(T).ToStaticDecode<(param_0: number, param_1?: number) => number>()
}
const F = Type.Constructor([Type.Readonly(Type.Array(Type.String()))], Type.Number())

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
