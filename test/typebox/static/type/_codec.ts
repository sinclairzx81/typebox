import { type Static, type StaticDecode, type StaticEncode, type TSchema, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/1429
// ------------------------------------------------------------------
{
  function myFn<T extends TSchema>(schema: T): Static<T>
  function myFn(schema: TSchema): unknown {
    return {} as any
  }
  const result = myFn(Type.Script(`{
    x: number,
    y: number  
  }`))

  Assert.IsExtendsMutual<typeof result, {
    x: number
    y: number
  }>(true)
}
// ------------------------------------------------------------------
// decode: string -> number -> boolean
//
// encode: boolean -> number -> string
// ------------------------------------------------------------------
{
  const T = Type.Codec(Type.String())
    .Decode((value) => 1)
    .Encode((value) => '')

  const S = Type.Codec(T)
    .Decode((value) => true)
    .Encode((value) => 1)
  type E = StaticEncode<typeof S>
  type D = StaticDecode<typeof S>
  Assert.IsExtendsMutual<D, boolean>(true) // input
  Assert.IsExtendsMutual<E, string>(true) // output
}
