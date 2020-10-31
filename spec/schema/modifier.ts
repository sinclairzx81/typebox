import { Type, ReadonlyModifier, OptionalModifier } from '@sinclair/typebox'
import * as assert from 'assert'

describe('Modifier', () => {
  it('Omit modifier',  () => {

    const T = Type.Object({
      a: Type.Readonly(Type.String()),
      b: Type.Optional(Type.String()),
    })
    
    const S = JSON.stringify(T)
    const P = JSON.parse(S) as any

    // check assignment on Type
    assert.equal(T.properties.a['modifier'], ReadonlyModifier)
    assert.equal(T.properties.b['modifier'], OptionalModifier)
    
    // check deserialized
    assert.equal(P.properties.a['modifier'], undefined)
    assert.equal(P.properties.b['modifier'], undefined)
  })
})
