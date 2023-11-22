import { TypeGuard, Type, Static } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

// prettier-ignore
describe('type/guard/Mapped', () => {
  it('Should guard mapped 1', () => {
    const T = Type.Mapped(Type.Union([
      Type.Literal('x'),
      Type.Literal('y'),
      Type.Literal('z'),
    ]), _ => Type.Number(), { custom: 1 })
    Assert.IsEqual(T, Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    }, { custom: 1 }))
  })
  it('Should guard mapped 2', () => {
    const T = Type.Mapped(Type.Union([
      Type.Literal('x'),
      Type.Literal('y'),
      Type.Literal('z'),
    ]), _ => Type.Number())
    Assert.IsEqual(T, Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number()
    }))
  })
  it('Should guard mapped 3', () => {
    const T = Type.Mapped(Type.Union([
      Type.Literal('x'),
      Type.Literal('y'),
      Type.Literal('z'),
    ]), K => K)
    Assert.IsEqual(T, Type.Object({
      x: Type.Literal('x'),
      y: Type.Literal('y'),
      z: Type.Literal('z'),
    }))
  })
  it('Should guard mapped 4', () => {
    const T = Type.Mapped(Type.TemplateLiteral('${0|1}${0|1}'), K => Type.Number())
    Assert.IsEqual(T, Type.Object({
      '00': Type.Number(),
      '01': Type.Number(),
      '10': Type.Number(),
      '11': Type.Number(),
    }))
  })
  it('Should guard mapped 5', () => {
    const T = Type.Mapped(Type.TemplateLiteral('${a|b}'), X => 
      Type.Mapped(Type.TemplateLiteral('${c|d}'), Y => 
        Type.Mapped(Type.TemplateLiteral('${e|f}'), Z =>
          Type.Tuple([X, Y, Z])
        )
      )
    )
    Assert.IsEqual(T, Type.Object({
      a: Type.Object({
        c: Type.Object({
          e: Type.Tuple([Type.Literal("a"), Type.Literal("c"), Type.Literal("e")]),
          f: Type.Tuple([Type.Literal("a"), Type.Literal("c"), Type.Literal("f")])
        }),
        d: Type.Object({
          e: Type.Tuple([Type.Literal("a"), Type.Literal("d"), Type.Literal("e")]),
          f: Type.Tuple([Type.Literal("a"), Type.Literal("d"), Type.Literal("f")])
        }),
      }),
      b: Type.Object({
        c: Type.Object({
          e: Type.Tuple([Type.Literal("b"), Type.Literal("c"), Type.Literal("e")]),
          f: Type.Tuple([Type.Literal("b"), Type.Literal("c"), Type.Literal("f")])
        }),
        d: Type.Object({
          e: Type.Tuple([Type.Literal("b"), Type.Literal("d"), Type.Literal("e")]),
          f: Type.Tuple([Type.Literal("b"), Type.Literal("d"), Type.Literal("f")])
        }),
      }),
    }))
  })
  it('Should guard mapped 6', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
      z: Type.Boolean()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => K)
    Assert.IsEqual(M, Type.Object({
      x: Type.Literal('x'),
      y: Type.Literal('y'),
      z: Type.Literal('z')
    }))
  })
  it('Should guard mapped 7', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
      z: Type.Boolean()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Index(T, K))
    Assert.IsEqual(M, Type.Object({
      x: Type.Number(),
      y: Type.String(),
      z: Type.Boolean()
    }))
  })
  it('Should guard mapped 8', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
      z: Type.Boolean()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Index(T, K, { custom: 1 }))
    Assert.IsEqual(M, Type.Object({
      x: Type.Number({ custom: 1 }),
      y: Type.String({ custom: 1 }),
      z: Type.Boolean({ custom: 1 })
    }))
  })
  // ----------------------------------------------------------------
  // Extract
  // ----------------------------------------------------------------
  it('Should guard mapped 9', () => {
    const T = Type.Object({
      x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Extract(Type.Index(T, K), Type.String())
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.String()
    }))
  })
  it('Should guard mapped 10', () => {
    const T = Type.Object({
      x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Extract(Type.Index(T, K), Type.Union([
        Type.String(),
        Type.Number()
      ]))
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Union([Type.String(), Type.Number()])
    }))
  })
  it('Should guard mapped 11', () => {
    const T = Type.Object({
      x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Extract(Type.Index(T, K), Type.Null())
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Never()
    }))
  })
  // ----------------------------------------------------------------
  // Extends
  // ----------------------------------------------------------------
  it('Should guard mapped 12', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
      z: Type.Boolean()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return ( 
        Type.Extends(K, Type.Literal('x'), Type.Literal(1), 
        Type.Extends(K, Type.Literal('y'), Type.Literal(2), 
        Type.Extends(K, Type.Literal('z'), Type.Literal(3), Type.Never())))
      )
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Literal(1),
      y: Type.Literal(2),
      z: Type.Literal(3),
    }))
  })
  it('Should guard mapped 13', () => {
    const T = Type.Object({
      x: Type.Number(),
      y: Type.String(),
      z: Type.Boolean()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return ( 
        Type.Extends(Type.Index(T, K), Type.Number(), Type.Literal(3), 
        Type.Extends(Type.Index(T, K), Type.String(), Type.Literal(2), 
        Type.Extends(Type.Index(T, K), Type.Boolean(), Type.Literal(1), Type.Never())))
      )
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Literal(3),
      y: Type.Literal(2),
      z: Type.Literal(1),
    }))
  })
  // ----------------------------------------------------------------
  // Exclude
  // ----------------------------------------------------------------
  it('Should guard mapped 14', () => {
    const T = Type.Object({
      x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Exclude(Type.Index(T, K), Type.String())
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Union([Type.Number(), Type.Boolean()])
    }))
  })
  it('Should guard mapped 15', () => {
    const T = Type.Object({
      x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Exclude(Type.Index(T, K), Type.Union([
        Type.String(),
        Type.Number()
      ]))
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Boolean()
    }))
  })
  it('Should guard mapped 16', () => {
    const T = Type.Object({
      x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Exclude(Type.Index(T, K), Type.Null())
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Union([Type.String(), Type.Number(), Type.Boolean()])
    }))
  })
  // ----------------------------------------------------------------
  // Non-Evaluated
  // ----------------------------------------------------------------
  it('Should guard mapped 17', () => {
    const T = Type.Object({ x: Type.Number() })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Array(Type.Index(T, K)))
    Assert.IsEqual(M, Type.Object({ x: Type.Array(Type.Number()) }))
  })
  it('Should guard mapped 18', () => {
    const T = Type.Object({ x: Type.Number() })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Promise(Type.Index(T, K)))
    Assert.IsEqual(M, Type.Object({ x: Type.Promise(Type.Number()) }))
  })
  it('Should guard mapped 19', () => {
    const T = Type.Object({ x: Type.Number() })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Function([Type.Index(T, K)], Type.Index(T, K)))
    Assert.IsEqual(M, Type.Object({ x: Type.Function([Type.Number()], Type.Number())}))
  })
  it('Should guard mapped 20', () => {
    const T = Type.Object({ x: Type.Number() })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Tuple([Type.Index(T, K), Type.Index(T, K)]))
    Assert.IsEqual(M, Type.Object({ x: Type.Tuple([Type.Number(), Type.Number()]) }))
  })
  it('Should guard mapped 21', () => {
    const T = Type.Object({ x: Type.Number() })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Union([Type.Index(T, K), Type.Index(T, K)]))
    Assert.IsEqual(M, Type.Object({ x: Type.Union([Type.Number(), Type.Number()]) }))
  })
  it('Should guard mapped 22', () => {
    const T = Type.Object({ x: Type.Number() })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Intersect([Type.Index(T, K), Type.Index(T, K)]))
    Assert.IsEqual(M, Type.Object({ x: Type.Intersect([Type.Number(), Type.Number()]) }))
  })
})
