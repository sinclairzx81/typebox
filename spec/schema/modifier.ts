import { Type, ReadonlyModifier, OptionalModifier } from '@sinclair/typebox'

import * as assert from 'assert'

import { expect } from 'chai';

describe('Modifier', () => {
  it('Omit modifier',  () => {

    const T = Type.Object({
      a: Type.Readonly(Type.String()),
      b: Type.Optional(Type.String()),
      c: Type.Hidden(Type.String()),
    })
    
    const S = JSON.stringify(T)
    const P = JSON.parse(S) as any

    // check assignment on Type
    assert.strictEqual(T.properties.a['modifier'], ReadonlyModifier)
    assert.strictEqual(T.properties.b['modifier'], OptionalModifier)

    expect(T.required).to.be.deep.eq(['a']);

    // Hidden-Modifier
    expect('c' in T.properties).to.be.false;
    
    // check deserialized
    assert.strictEqual(P.properties.a['modifier'], undefined)
    assert.strictEqual(P.properties.b['modifier'], undefined)
  });

  it('Type.Hidden can only be used on Objects', () => 
  {
    const hidden = Type.Hidden(Type.Object({}));

    expect(() => Type.Array(hidden)).to.throw();
    expect(() => Type.Tuple([Type.String(), hidden])).to.throw();
    expect(() => Type.Intersect([Type.Object({}), hidden])).to.throw();
    expect(() => Type.Dict(hidden)).to.throw();
  });
})
