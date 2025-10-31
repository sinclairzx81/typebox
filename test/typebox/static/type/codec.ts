import { type Static, type TSchema, Type } from 'typebox'
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
    x: number,
    y: number
  }>(true)
}