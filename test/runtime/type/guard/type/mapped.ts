import { Type } from '@sinclair/typebox'
import { Assert } from '../../../assert/index'

// prettier-ignore
describe('guard/type/Mapped', () => {
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
  // ----------------------------------------------------------------
  // Numeric Keys
  // ----------------------------------------------------------------
  it('Should guard mapped 23', () => {
    const T = Type.Object({
      0: Type.Number(),
      1: Type.Number(),
      2: Type.Number()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => K)
    Assert.IsEqual(M, Type.Object({
      0: Type.Literal('0'),
      1: Type.Literal('1'),
      2: Type.Literal('2'),
    }))
  })
  it('Should guard mapped 24', () => {
    const T = Type.Object({
      0: Type.Number(),
      1: Type.Number(),
      2: Type.Number()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Index(T, K))
    Assert.IsEqual(M, Type.Object({
      0: Type.Number(),
      1: Type.Number(),
      2: Type.Number(),
    }))
  })
  it('Should guard mapped 25', () => {
    const T = Type.Object({
      0: Type.Number(),
      1: Type.Number(),
      2: Type.Number()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.String())
    Assert.IsEqual(M, Type.Object({
      0: Type.String(),
      1: Type.String(),
      2: Type.String(),
    }))
  })
  it('Should guard mapped 26', () => {
    const T = Type.Object({
      0: Type.Number(),
      1: Type.Number(),
      2: Type.Number()
    })
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Extends(K, Type.Literal('1'), Type.String(), Type.Number()))
    Assert.IsEqual(M, Type.Object({
      0: Type.Number(),
      1: Type.String(),
      2: Type.Number(),
    }))
  })
  // ----------------------------------------------------------------
  // Modifiers: Optional
  // ----------------------------------------------------------------
  it('Should guard mapped 27', () => {
    const T = Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Number()
    })
    // subtractive
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Optional(Type.Index(T, K), false))
    Assert.IsEqual(M, Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }))
  })
  it('Should guard mapped 28', () => {
    const T = Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Number()
    })
    // additive
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Optional(Type.Index(T, K), true))
    Assert.IsEqual(M, Type.Object({
      x: Type.Optional(Type.Number()),
      y: Type.Optional(Type.Number())
    }))
  })
  // ----------------------------------------------------------------
  // Modifiers: Readonly
  // ----------------------------------------------------------------
  it('Should guard mapped 27', () => {
    const T = Type.Object({
      x: Type.Readonly(Type.Number()),
      y: Type.Number()
    })
    // subtractive
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Readonly(Type.Index(T, K), false))
    Assert.IsEqual(M, Type.Object({
      x: Type.Number(),
      y: Type.Number()
    }))
  })
  it('Should guard mapped 28', () => {
    const T = Type.Object({
      x: Type.Readonly(Type.Number()),
      y: Type.Number()
    })
    // additive
    const M = Type.Mapped(Type.KeyOf(T), K => Type.Readonly(Type.Index(T, K), true))
    Assert.IsEqual(M, Type.Object({
      x: Type.Readonly(Type.Number()),
      y: Type.Readonly(Type.Number())
    }))
  })
  // ----------------------------------------------------------------
  // Finite Boolean
  // ----------------------------------------------------------------
  it('Should guard mapped 29', () => {
    const T = Type.TemplateLiteral('${boolean}')
    const M = Type.Mapped(T, K => K)
    Assert.IsEqual(M, Type.Object({
      true: Type.Literal('true'),
      false: Type.Literal('false'),
    }))
  })
  it('Should guard mapped 30', () => {
    const T = Type.TemplateLiteral('${0|1}${boolean}')
    const M = Type.Mapped(T, K => K) 
    Assert.IsEqual(M, Type.Object({
      '0true':  Type.Literal('0true'),
      '0false':  Type.Literal('0false'),
      '1true':  Type.Literal('1true'),
      '1false':  Type.Literal('1false'),
    }))
  })
  it('Should guard mapped 31', () => {
    const T = Type.TemplateLiteral('${boolean}${0|1}')
    const M = Type.Mapped(T, K => K) 
    Assert.IsEqual(M, Type.Object({
      'true0':  Type.Literal('true0'),
      'true1':  Type.Literal('true1'),
      'false0':  Type.Literal('false0'),
      'false1':  Type.Literal('false1'),
    }))
  })
  // ----------------------------------------------------------------
  // Numeric Mapping
  // ----------------------------------------------------------------
  it('Should guard mapped 32', () => {
    const T = Type.TemplateLiteral([
      Type.Union([Type.Literal(0), Type.Literal(1)]),
      Type.Union([Type.Literal(0), Type.Literal(1)]),
    ])
    const M = Type.Mapped(T, (K) => K)
    Assert.IsEqual(M, Type.Object({
      '00':  Type.Literal('00'),
      '01':  Type.Literal('01'),
      '10':  Type.Literal('10'),
      '11':  Type.Literal('11'),
    }))
  })
  // ----------------------------------------------------------------
  // Indexed Key Remap
  // ----------------------------------------------------------------
  it('Should guard mapped 33', () => {
    const T = Type.Object({
      hello: Type.Number(),
      world: Type.String(),
    })
    const M = Type.Mapped(Type.Uppercase(Type.KeyOf(T)), (K) => {
      return Type.Index(T, Type.Lowercase(K))
    })
    Assert.IsEqual(M, Type.Object({
      HELLO: Type.Number(),
      WORLD: Type.String()
    }))
  })
  // ----------------------------------------------------------------
  // Partial
  // ----------------------------------------------------------------
  it('Should guard mapped 34', () => {
    const T = Type.Object({
      x: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      y: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    })
    const M = Type.Mapped(Type.KeyOf(T), (K) => {
      return Type.Partial(Type.Index(T, K))
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Partial(Type.Object({
        x: Type.Optional(Type.Number()),
        y: Type.Optional(Type.Number()),
      })),
      y: Type.Partial(Type.Object({
        x: Type.Optional(Type.Number()),
        y: Type.Optional(Type.Number()),
      })),
    }))
  })
  // ----------------------------------------------------------------
  // Required
  // ----------------------------------------------------------------
  it('Should guard mapped 35', () => {
    const T = Type.Object({
      x: Type.Partial(Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      })),
      y: Type.Partial(Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      })),
    })
    const M = Type.Mapped(Type.KeyOf(T), (K) => {
      return Type.Required(Type.Index(T, K))
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      y: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    }))
  })
  // ------------------------------------------------------------------
  // Pick With Key
  // ------------------------------------------------------------------
  it('Should guard mapped 36', () => {
    const T = Type.Object({
      x: Type.Object({
        x: Type.Number(),
        y: Type.Number()
      }),
      y: Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Pick(T, K)
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Object({
        x: Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        })
      }),
      y: Type.Object({
        y: Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        })
      }),
    }))
  })
  // ------------------------------------------------------------------
  // Pick With Result
  // ------------------------------------------------------------------
  it('Should guard mapped 37', () => {
    const T = Type.Object({
      x: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      y: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    })
    const M = Type.Mapped(Type.KeyOf(T), (K) => {
      return Type.Pick(Type.Index(T, K), ['x'])
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Object({ x: Type.Number() }),
      y: Type.Object({ x: Type.Number() })
    }))
  })
  // ------------------------------------------------------------------
  // Omit With Key
  // ------------------------------------------------------------------
  it('Should guard mapped 36', () => {
    const T = Type.Object({
      x: Type.Object({
        x: Type.Number(),
        y: Type.Number()
      }),
      y: Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    })
    const M = Type.Mapped(Type.KeyOf(T), K => {
      return Type.Omit(T, K)
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Object({
        y: Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        })
      }),
      y: Type.Object({
        x: Type.Object({
          x: Type.Number(),
          y: Type.Number(),
        })
      }),
    }))
  })
  // ------------------------------------------------------------------
  // Omit With Result
  // ------------------------------------------------------------------
  it('Should guard mapped 37', () => {
    const T = Type.Object({
      x: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
      y: Type.Object({
        x: Type.Number(),
        y: Type.Number(),
      }),
    })
    const M = Type.Mapped(Type.KeyOf(T), (K) => {
      return Type.Omit(Type.Index(T, K), ['x'])
    })
    Assert.IsEqual(M, Type.Object({
      x: Type.Object({ y: Type.Number() }),
      y: Type.Object({ y: Type.Number() })
    }))
  })
})
