import { Type, modifierSymbol } from '../src/typebox'
import * as assert from 'assert'

describe('Modifier', () => {
  it('Omit modifierSymbol',  () => {

    const T = Type.Object({
      a: Type.Readonly(Type.String()),
      b: Type.Optional(Type.String()),
    })
    
    const S = JSON.stringify(T)
    const P = JSON.parse(S) as any

    // check assignment on Type
    assert.equal(T.properties.a[modifierSymbol], 'readonly')
    assert.equal(T.properties.b[modifierSymbol], 'optional')
    
    // check deserialized
    assert.equal(P.properties.a[modifierSymbol], undefined)
    assert.equal(P.properties.b[modifierSymbol], undefined)
  })
})
