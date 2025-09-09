import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Repair.Union')

const A = Type.Object(
  {
    type: Type.Literal('A'),
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number()
  },
  { additionalProperties: false }
)
const B = Type.Object(
  {
    type: Type.Literal('B'),
    a: Type.String(),
    b: Type.String(),
    c: Type.String()
  },
  { additionalProperties: false }
)
const T = Type.Union([A, B])
const E = {
  type: 'A',
  x: 0,
  y: 0,
  z: 0
}
Test('Should Repair 1', () => {
  const value = 'hello'
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 2', () => {
  const value = 1
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 3', () => {
  const value = true
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 4', () => {
  const value = {}
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 5', () => {
  const value = [1]
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 6', () => {
  const value = undefined
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 7', () => {
  const value = null
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, E)
})
Test('Should Repair 8', () => {
  const value = { type: 'A', x: 1, y: 2, z: 3 }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 9', () => {
  const value = { type: 'B', a: 'a', b: 'b', c: 'c' }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, value)
})
Test('Should Repair 10', () => {
  const value = { type: 'A', a: 'a', b: 'b', c: 'c' }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { type: 'A', x: 0, y: 0, z: 0 })
})
Test('Should Repair 11', () => {
  const value = { type: 'B', x: 1, y: 2, z: 3 }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { type: 'B', a: '', b: '', c: '' })
})
Test('Should Repair 12', () => {
  const value = { type: 'A', a: 'a', b: 'b', c: null }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { type: 'A', x: 0, y: 0, z: 0 })
})
Test('Should Repair 13', () => {
  const value = { type: 'B', x: 1, y: 2, z: {} }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { type: 'B', a: '', b: '', c: '' })
})
Test('Should Repair 14', () => {
  const value = { type: 'B', x: 1, y: 2, z: null }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { type: 'B', a: '', b: '', c: '' })
})
Test('Should Repair 15', () => {
  const value = { x: 1 }
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { type: 'A', x: 1, y: 0, z: 0 })
})
Test('Should Repair 16', () => {
  const value = { a: null } // property existing should contribute
  const result = Value.Repair(T, value)
  Assert.IsEqual(result, { type: 'B', a: 'null', b: '', c: '' })
})
Test('Should Repair 17', () => {
  const result = Value.Repair(
    Type.Object({
      id: Type.Number(),
      value: Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')], { default: 'C' })
    }),
    {
      id: 42,
      value: 'D'
    }
  )
  Assert.IsEqual(result, {
    id: 42,
    value: 'C'
  })
})
Test('Should Repair 18', () => {
  const result = Value.Repair(
    Type.Object({
      id: Type.Number(),
      value: Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C')], { default: 'C' })
    }),
    {
      id: 42,
      value: 'B'
    }
  )
  Assert.IsEqual(result, {
    id: 42,
    value: 'B'
  })
})
// ----------------------------------------------------------------
// https://github.com/sinclairzx81/typebox/issues/880
// ----------------------------------------------------------------

Test('Should Repair 19', () => {
  const A = Type.Object({ type: Type.Literal('A') })
  const B = Type.Object({ type: Type.Literal('B'), value: Type.Number() })
  const RA = Type.Union([A, B])
  // variant 0
  Assert.IsEqual(Value.Repair({ A, B }, RA, { type: 'B' }), { type: 'B', value: 0 })
  // variant 1
  Assert.IsEqual(Value.Repair({ A, B }, RA, { type: 'A' }), { type: 'A' })

  // note: should re-enable this test once Check has Context passing.
  // const RB = Type.Union([Type.Ref('A'), Type.Ref('B')])
  // Assert.IsEqual(Value.Repair({ A, B }, RB, { type: 'B' }), { type: 'B', value: 0 })
  // Assert.IsEqual(Value.Repair({ A, B }, RB, { type: 'A' }), { type: 'A' })
})

// ------------------------------------------------------------------
// ref: https://github.com/sinclairzx81/typebox/issues/1268
// ------------------------------------------------------------------
Test('Should Repair 20', () => {
  const A = Type.Union([
    Type.Union([
      Type.Object({
        type: Type.Literal('a'),
        name: Type.String(),
        in: Type.String()
      }),
      Type.Object({
        type: Type.Literal('b'),
        description: Type.Optional(Type.String()),
        nested: Type.Object({
          a: Type.String(),
          b: Type.Optional(Type.String())
        })
      })
    ]),
    Type.Object({
      $ref: Type.String(),
      description: Type.Optional(Type.String())
    })
  ])

  Assert.IsEqual(
    Value.Repair(A, {
      type: 'b',
      description: 'Hello World',
      nested: {
        b: 'hello'
      }
    }),
    {
      type: 'b',
      description: 'Hello World',
      nested: { a: '', b: 'hello' }
    }
  )
})

Test('Should Repair 21', () => {
  const A = Type.Union([
    Type.Union([
      Type.Object({
        prop1: Type.String(),
        prop2: Type.String(),
        prop3: Type.String()
      }),
      Type.Object({
        prop1: Type.String(),
        prop4: Type.String(),
        prop5: Type.String()
      })
    ]),
    Type.Union([
      Type.Object({
        prop6: Type.String(),
        prop7: Type.String(),
        prop8: Type.String()
      }),
      Type.Object({
        prop1: Type.String(),
        prop9: Type.String(),
        prop10: Type.String()
      })
    ])
  ])

  // Picks the first union variant when the score is equal
  Assert.IsEqual(
    Value.Repair(A, {
      prop1: ''
    }),
    {
      prop1: '',
      prop2: '',
      prop3: ''
    }
  )

  Assert.IsEqual(
    Value.Repair(A, {
      prop1: '',
      prop4: ''
    }),
    {
      prop1: '',
      prop4: '',
      prop5: ''
    }
  )

  Assert.IsEqual(
    Value.Repair(A, {
      prop6: ''
    }),
    {
      prop6: '',
      prop7: '',
      prop8: ''
    }
  )
})

Test('Should Repair 22', () => {
  const A = Type.Union([
    Type.Object({
      prop1: Type.String(),
      prop2: Type.String(),
      prop3: Type.String()
    }),
    Type.Object({
      prop4: Type.String(),
      prop5: Type.String(),
      prop6: Type.String()
    }),
    Type.Union([
      Type.Object({
        prop4: Type.String(),
        prop5: Type.String(),
        prop6: Type.String()
      }),
      Type.Object({
        prop1: Type.String(),
        prop2: Type.String(),
        prop7: Type.String(),
        prop8: Type.String()
      })
    ])
  ])

  Assert.IsEqual(
    Value.Repair(A, {
      prop1: '',
      prop2: '',
      prop7: ''
    }),
    {
      prop1: '',
      prop2: '',
      prop7: '',
      prop8: ''
    }
  )
})
Test('Should Repair 23', () => {
  const A = Type.Union([
    Type.Object({
      prop1: Type.String(),
      prop2: Type.String(),
      prop3: Type.String()
    }),
    Type.Union([
      Type.Object({
        prop4: Type.String(),
        prop5: Type.String(),
        prop6: Type.String()
      }),
      Type.Union([
        Type.Object({
          prop1: Type.String(),
          prop2: Type.String(),
          prop7: Type.String(),
          prop8: Type.String()
        }),
        Type.Union([
          Type.Object({
            prop1: Type.String(),
            prop2: Type.String(),
            prop9: Type.String(),
            prop10: Type.String()
          }),
          Type.Object({
            prop1: Type.String(),
            prop2: Type.String(),
            prop11: Type.String(),
            prop12: Type.String()
          })
        ])
      ])
    ])
  ])
  Assert.IsEqual(
    Value.Repair(A, {
      prop1: '',
      prop2: '',
      prop9: ''
    }),
    {
      prop1: '',
      prop2: '',
      prop9: '',
      prop10: ''
    }
  )
})
// ------------------------------------------------------------------
// ref: https://github.com/sinclairzx81/typebox/issues/1292
// ------------------------------------------------------------------
Test('Should Repair 24', () => {
  const schema = Type.Union([
    Type.Object({
      summary: Type.Optional(Type.String()),
      description: Type.Optional(Type.String()),
      parameters: Type.Optional(Type.Array(Type.Any())),
      responses: Type.Optional(Type.Record(Type.String(), Type.Any())),
      requestBody: Type.Optional(Type.Any())
    }),
    Type.Object({
      $ref: Type.String(),
      summary: Type.Optional(Type.String())
    })
  ])
  Assert.IsEqual(
    Value.Repair(schema, {
      summary: 'Test Summary',
      parameters: {}
    }),
    {
      summary: 'Test Summary',
      parameters: []
    }
  )
})
Test('Should Repair 25', () => {
  const A = Type.Union([
    Type.Object({
      prop1: Type.String(),
      prop2: Type.String(),
      prop3: Type.String()
    }),
    Type.Object({
      prop1: Type.String(),
      prop2: Type.String(),
      prop4: Type.String(),
      prop5: Type.String(),
      prop6: Type.String(),
      prop7: Type.String(),
      prop8: Type.String(),
      prop9: Type.String(),
      prop10: Type.String()
    })
  ])

  Assert.IsEqual(
    Value.Repair(A, {
      prop1: '',
      prop2: '',
      prop7: ''
    }),
    {
      prop1: '',
      prop2: '',
      prop4: '',
      prop5: '',
      prop6: '',
      prop7: '',
      prop8: '',
      prop9: '',
      prop10: ''
    }
  )
})
// ------------------------------------------------------------------
// Coverage
// ------------------------------------------------------------------
Test('Should Repair 26', () => {
  const A = Type.Number()
  const B = Type.String()
  const T = Type.Union([
    Type.Ref('A'),
    Type.Ref('B')
  ])
  const R = Value.Repair({ A, B }, T, 'hello')
  Assert.IsEqual(R, 'hello')
})
Test('Should Repair 27', () => {
  const A = Type.Number()
  const T = Type.Union([
    Type.Ref('A'),
    Type.Ref('B')
  ])
  Assert.Throws(() => Value.Repair({ A }, T, 'hello'))
})
Test('Should Repair 28', () => {
  const A = Type.Number()
  const B = Type.String()
  const T = Type.Union([
    Type.Ref('A'),
    Type.Ref('B')
  ], {
    default: 'hello'
  })
  const R = Value.Repair({ A, B }, T, true)
  Assert.IsEqual(R, 'hello')
})
Test('Should Repair 29', () => {
  const T = Type.Union([
    Type.Number(),
    Type.String()
  ])
  const R = Value.Repair(T, true)
  Assert.IsEqual(R, 1)
})
