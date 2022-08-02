import { Type } from '@sinclair/typebox'

export namespace Cases {
  export const Number = Type.Number()

  export const String = Type.String()

  export const Boolean = Type.Boolean()

  export const Null = Type.Null()

  export const RegEx = Type.RegEx(/foo/, { default: 'foo' })

  export const ObjectA = Type.Object({
    p0: Type.String(),
    p1: Type.Number(),
    p2: Type.Number(),
    p3: Type.Array(Type.Number(), { minItems: 4 }),
    p4: Type.Object({
      x: Type.Number(),
      y: Type.Number(),
      z: Type.Number(),
    }),
    p5: Type.Object({
      a: Type.String(),
      b: Type.String(),
      c: Type.String(),
    }),
  })

  export const ObjectB = Type.Object(ObjectA.properties, {
    additionalProperties: false,
  })

  export const Tuple = Type.Tuple([Type.String(), Type.Number(), Type.Boolean()])

  export const Union = Type.Union([Type.Object({ x: Type.Number(), y: Type.Number() }), Type.Object({ a: Type.String(), b: Type.String() })], { default: { a: 'a', b: 'b' } })

  export const Recursive = Type.Recursive(
    (Recursive) =>
      Type.Object({
        id: Type.String(),
        nodes: Type.Array(Recursive),
      }),
    {
      default: {
        id: '',
        nodes: [
          {
            id: '',
            nodes: [
              { id: '', nodes: [] },
              { id: '', nodes: [] },
              { id: '', nodes: [] },
            ],
          },
          {
            id: '',
            nodes: [
              { id: '', nodes: [] },
              { id: '', nodes: [] },
              { id: '', nodes: [] },
            ],
          },
          {
            id: '',
            nodes: [
              { id: '', nodes: [] },
              { id: '', nodes: [] },
              { id: '', nodes: [] },
            ],
          },
        ],
      },
    },
  )

  export const Vector4 = Type.Tuple([Type.Number(), Type.Number(), Type.Number(), Type.Number()])

  export const Matrix4 = Type.Array(Type.Array(Type.Number()), {
    default: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  })

  export const Literal_String = Type.Literal('foo')

  export const Literal_Number = Type.Literal(1)

  export const Literal_Boolean = Type.Literal(true)

  export const Array_Number = Type.Array(Type.Number(), { minItems: 16 })

  export const Array_String = Type.Array(Type.String(), { minItems: 16 })

  export const Array_Boolean = Type.Array(Type.Boolean(), { minItems: 16 })

  export const Array_ObjectA = Type.Array(ObjectA, { minItems: 16 })

  export const Array_ObjectB = Type.Array(ObjectB, { minItems: 16 })

  export const Array_Tuple = Type.Array(Tuple, { minItems: 16 })

  export const Array_Union = Type.Array(Union, { minItems: 16 })

  export const Array_Recursive = Type.Array(Recursive, { minItems: 16 })

  export const Array_Vector4 = Type.Array(Vector4, { minItems: 16 })

  export const Array_Matrix4 = Type.Array(Matrix4, { minItems: 16 })
}
