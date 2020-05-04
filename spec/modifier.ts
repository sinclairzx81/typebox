import { Type, Readonly, ReadonlyOptional, Optional } from '../src/typebox'
import * as assert from 'assert'

describe('Modifier', () => {
  it('Should omit modifier properties',  () => {
    
    const T = Type.Object({
      a: Type.ReadonlyOptional(Type.String()),
      b: Type.Readonly(Type.String()),
      c: Type.Optional(Type.String()),
    })

    const S = JSON.stringify(T)
    const P = JSON.parse(S) as any

    // check assignment on Type
    assert.equal(T.properties.a.modifier, ReadonlyOptional)
    assert.equal(T.properties.b.modifier, Readonly)
    assert.equal(T.properties.c.modifier, Optional)
    
    // check deserialized
    assert.equal(P.properties.a.modifier, undefined)
    assert.equal(P.properties.b.modifier, undefined)
    assert.equal(P.properties.c.modifier, undefined)
  })
})
