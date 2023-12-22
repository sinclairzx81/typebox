import { Expect } from './assert'
import { Type, TRef, TObject, TNumber } from '@sinclair/typebox'

// prettier-ignore
const Vector: TObject<{
  x: TNumber;
  y: TNumber;
}> = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
}, { $id: 'Vector' })

// prettier-ignore
const VectorRef: TRef<TObject<{
  x: TNumber;
  y: TNumber;
}>> = Type.Ref(Vector)

// prettier-ignore
const Vertex: TObject<{
  position: TRef<TObject<{
      x: TNumber;
      y: TNumber;
  }>>;
  texcoord: TRef<TObject<{
      x: TNumber;
      y: TNumber;
  }>>;
}> = Type.Object({
  position: VectorRef,
  texcoord: VectorRef,
})

// prettier-ignore
const VertexDeref: TObject<{
  position: TObject<{
      x: TNumber;
      y: TNumber;
  }>;
  texcoord: TObject<{
      x: TNumber;
      y: TNumber;
  }>;
}> = Type.Deref(Vertex, [Vector])

// prettier-ignore
Expect(VertexDeref).ToStatic<{
  position: {
      x: number;
      y: number;
  };
  texcoord: {
      x: number;
      y: number;
  };
}>
