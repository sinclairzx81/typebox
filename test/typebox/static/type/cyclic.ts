
import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// ------------------------------------------------------------------
// NonCyclic
// ------------------------------------------------------------------
{
  const NonCyclic = Type.Cyclic({
    NonCyclic: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    })
  }, 'NonCyclic')
  type NonCyclic = Static<typeof NonCyclic>
  // Invariant
  Assert.IsExtendsMutual<{ x: 1, y: 2, z: false }, NonCyclic>(false)
  // Extends
  Assert.IsExtendsMutual<{ x: number, y: number, z: number }, NonCyclic>(true)
}

// ------------------------------------------------------------------
// Deep
//
// https://github.com/sinclairzx81/typebox/issues/1356
// ------------------------------------------------------------------
{
  const Deep = Type.Cyclic({
    Deep: Type.Object({
      deep: Type.Ref('Deep')
    })
  }, 'Deep')
  type Deep = Static<typeof Deep>
  // Invariant
  Assert.IsExtends<{ deep: 1 }, Deep>(false)
  Assert.IsExtends<{ deep: { deep: { deep: 1 } } }, Deep>(false)
  
  // Extends
  Assert.IsExtends<{ deep: any }, Deep>(true)
  Assert.IsExtends<{ deep: { deep: { deep: any } } }, Deep>(true)
}
// ------------------------------------------------------------------
// JsonValue
//
// https://github.com/sinclairzx81/typebox/issues/1356
// ------------------------------------------------------------------
{
  const JsonValue = Type.Cyclic({
    JsonValue: Type.Union([
      Type.Record(Type.String(), Type.Ref('JsonValue')),
      Type.Array(Type.Ref('JsonValue')),
      Type.String(),
      Type.Number(),
      Type.Boolean(),
      Type.Null(),
    ])
  }, 'JsonValue')

  type JsonValue = Static<typeof JsonValue>
  // Invariant
  Assert.IsExtends<bigint, JsonValue>(false)
  Assert.IsExtends<bigint[], JsonValue>(false)
  Assert.IsExtends<[bigint], JsonValue>(false)
  Assert.IsExtends<{ x: bigint }, JsonValue>(false)

  // Extends
  Assert.IsExtends<'A', JsonValue>(true)
  Assert.IsExtends<1, JsonValue>(true)
  Assert.IsExtends<true, JsonValue>(true)
  Assert.IsExtends<null, JsonValue>(true)
  Assert.IsExtends<null[], JsonValue>(true)
  Assert.IsExtends<[null], JsonValue>(true)
  Assert.IsExtends<{ x: null }, JsonValue>(true)
}
