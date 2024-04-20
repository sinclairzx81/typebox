import { Expect } from './assert'
import { Type } from '@sinclair/typebox'
{
  // simple
  const T = Type.Constructor([Type.Number(), Type.Boolean()], Type.String())
  Expect(T).ToStatic<new (param_0: number, param_1: boolean) => string>()
}
{
  // nested
  // prettier-ignore
  const T = Type.Constructor([Type.Number(), Type.String()], Type.Object({
    method: Type.Constructor([Type.Number(), Type.String()], Type.Boolean()),
  }))
  Expect(T).ToStatic<new (param_0: number, param_1: string) => { method: new (param_0: number, param_1: string) => boolean }>()
}
{
  // readonly-optional
  const T = Type.Constructor([Type.ReadonlyOptional(Type.Array(Type.Number()))], Type.Number())
  Expect(T).ToStaticDecode<new (param_0?: readonly number[]) => number>()
}
{
  // readonly
  const T = Type.Constructor([Type.Readonly(Type.Array(Type.Number()))], Type.Number())
  Expect(T).ToStaticDecode<new (param_0: readonly number[]) => number>()
}
{
  // optional 1
  const T = Type.Constructor([Type.Optional(Type.Number())], Type.Number())
  Expect(T).ToStaticDecode<new (param_0?: number) => number>()
}
{
  // optional 2
  const T = Type.Constructor([Type.Number(), Type.Optional(Type.Number())], Type.Number())
  Expect(T).ToStaticDecode<new (param_0: number, param_1?: number) => number>()
}
{
  // decode 2
  const S = Type.Transform(Type.Integer())
    .Decode((value) => new Date(value))
    .Encode((value) => value.getTime())
  const T = Type.Constructor([S], Type.String())
  Expect(T).ToStaticDecode<new (param_0: Date) => string>()
}
{
  // decode 1
  const S = Type.Transform(Type.Integer())
    .Decode((value) => new Date(value))
    .Encode((value) => value.getTime())
  const T = Type.Constructor([Type.Number()], S)
  Expect(T).ToStaticDecode<new (param_0: number) => Date>()
}
