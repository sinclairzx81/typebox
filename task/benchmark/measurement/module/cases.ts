import { Type } from '@sinclair/typebox'

export namespace Cases {
  export const Literal_String = Type.Literal('hello')

  export const Literal_Number = Type.Literal(1)

  export const Literal_Boolean = Type.Literal(true)

  export const Primitive_Number = Type.Number()

  export const Primitive_String = Type.String()

  export const Primitive_String_Pattern = Type.String({ pattern: 'foo', default: 'foo' })

  export const Primitive_Boolean = Type.Boolean()

  export const Primitive_Null = Type.Null()

  export const Object_Unconstrained = Type.Object({
    number: Type.Number(),
    negNumber: Type.Number(),
    maxNumber: Type.Number(),
    string: Type.String(),
    longString: Type.String(),
    boolean: Type.Boolean(),
    deeplyNested: Type.Object({
      foo: Type.String(),
      num: Type.Number(),
      bool: Type.Boolean(),
    }),
  })

  export const Object_Constrained = Type.Object(Object_Unconstrained.properties, {
    additionalProperties: false,
  })

  export const Object_Vector3 = Type.Object({
    x: Type.Number(),
    y: Type.Number(),
    z: Type.Number(),
  })

  export const Object_Box3D = Type.Object({
    scale: Object_Vector3,
    position: Object_Vector3,
    rotate: Object_Vector3,
    pivot: Object_Vector3,
  })
  export const Object_Recursive = Type.Recursive(
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

  // prettier-ignore
  export const Tuple_Primitive = Type.Tuple([
    Type.String(), 
    Type.Number(), 
    Type.Boolean()
  ])
  // prettier-ignore
  export const Tuple_Object = Type.Tuple([
    Type.Object({ x: Type.Number(), y: Type.Number() }), 
    Type.Object({ a: Type.String(), b: Type.String() })
  ])
  // prettier-ignore
  export const Composite_Intersect = Type.Intersect([
    Type.Object({ x: Type.Number(), y: Type.Number() }), 
    Type.Object({ a: Type.String(), b: Type.String() })
  ], { default: { x: 1, y: 2, a: 'a', b: 'b' } })

  // prettier-ignore
  export const Composite_Union = Type.Union([
    Type.Object({ x: Type.Number(), y: Type.Number() }), 
    Type.Object({ a: Type.String(), b: Type.String() })
  ], { default: { a: 'a', b: 'b' } })

  export const Math_Vector4 = Type.Tuple([Type.Number(), Type.Number(), Type.Number(), Type.Number()])

  export const Math_Matrix4 = Type.Array(Type.Array(Type.Number()), {
    default: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  })

  export const Array_Primitive_Number = Type.Array(Type.Number(), { minItems: 4 })

  export const Array_Primitive_String = Type.Array(Type.String(), { minItems: 4 })

  export const Array_Primitive_Boolean = Type.Array(Type.Boolean(), { minItems: 4 })

  export const Array_Object_Unconstrained = Type.Array(Object_Unconstrained, { minItems: 4 })

  export const Array_Object_Constrained = Type.Array(Object_Constrained, { minItems: 4 })

  export const Array_Object_Recursive = Type.Array(Object_Recursive, { minItems: 4 })

  export const Array_Tuple_Primitive = Type.Array(Tuple_Primitive, { minItems: 4 })

  export const Array_Tuple_Object = Type.Array(Tuple_Object, { minItems: 4 })

  export const Array_Composite_Intersect = Type.Array(Composite_Intersect, { minItems: 4 })

  export const Array_Composite_Union = Type.Array(Composite_Union, { minItems: 4 })

  export const Array_Math_Vector4 = Type.Array(Math_Vector4, { minItems: 4 })

  export const Array_Math_Matrix4 = Type.Array(Math_Matrix4, { minItems: 4 })
}
