import { Expect } from './assert'
import { Type, Static } from '@sinclair/typebox'

{
  const T = Type.ReturnType(Type.Function([], Type.String()))

  type T = Static<typeof T>

  Expect(T).ToInfer<string>()
}

{
  const T = Type.ReturnType(Type.Function([Type.Number()], Type.Number()))

  type T = Static<typeof T>

  Expect(T).ToInfer<number>()
}
