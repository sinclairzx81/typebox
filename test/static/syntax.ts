import { Expect } from './assert'
import { Syntax } from '@sinclair/typebox/syntax'

// prettier-ignore
{
  const Basis = Syntax(`{
    x: 1,
    y: 2,
    z: 3  
  }`)

  Expect(Basis).ToStatic<{
    x: 1,
    y: 2,
    z: 3,
  }>()
}
// prettier-ignore
{
  const Vector = Syntax(`<X, Y, Z>{
    x: X,
    y: Y,
    z: Z  
  }`)
  const Basis = Syntax({ Vector }, `{
    x: Vector<1, 0, 0>,
    y: Vector<0, 1, 0>,
    z: Vector<0, 0, 1>,
  }`)
  Expect(Basis).ToStatic<{
    x: { x: 1, y: 0, z: 0 },
    y: { x: 0, y: 1, z: 0 },
    z: { x: 0, y: 0, z: 1 },
  }>()
}
