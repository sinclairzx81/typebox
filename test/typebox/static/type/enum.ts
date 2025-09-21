import { type Static, Type } from 'typebox'
import { Assert } from 'test'

// deno-fmt-ignore-file

// ------------------------------------------------------------------
// Standard
// ------------------------------------------------------------------
{
  const T = Type.Enum([1, 'A', null])
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 1 | 'A' | null>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ------------------------------------------------------------------
// Exterior Readonly
// ------------------------------------------------------------------
{
  const X = [1, 'A', null] as const
  const T = Type.Enum(X)
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 1 | 'A' | null>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ------------------------------------------------------------------
// Object Pattern
// ------------------------------------------------------------------
{
  const T = Type.Enum(
    {
      A: 1,
      B: 'A',
      C: null
    } as const
  )
  type T = Static<typeof T>

  Assert.IsExtendsMutual<T, 1 | 'A' | null>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ------------------------------------------------------------------
// TypeScript Enum: Small
// ------------------------------------------------------------------
{
  enum E { A, B, C }
  const T = Type.Enum(E)
  type T = Static<typeof T>
  Assert.IsExtends<T, E>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
// ------------------------------------------------------------------
// TypeScript Enum: Large
// ------------------------------------------------------------------
{
  enum E {
    A1,  A2,  A3,  A4,  A5,  A6,  A7,  A8,  A9,  A10, A11, A12, A13, A14, A15, A16,
    A17, A18, A19, A20, A21, A22, A23, A24, A25, A26, A27, A28, A29, A30, A31, A32,
    A33, A34, A35, A36, A37, A38, A39, A40, A41, A42, A43, A44, A45, A46, A47, A48,
    A49, A50, A51, A52, A53, A54, A55, A56, A57, A58, A59, A60, A61, A62, A63, A64,
    A65, A66, A67, A68, A69, A70, A71, A72, A73, A74, A75, A76, A77, A78, A79, A80,
    A81, A82, A83, A84, A85, A86, A87, A88, A89, A90, A91, A92, A93, A94, A95, A96,
    A97, A98, A99, A100, A101, A102, A103, A104, A105, A106, A107, A108, A109, A110, A111, A112,
    A113, A114, A115, A116, A117, A118, A119, A120, A121, A122, A123, A124, A125, A126, A127, A128
  };
  const T = Type.Enum(E)
  type T = Static<typeof T>
  Assert.IsExtends<T, E>(true)
  Assert.IsExtendsMutual<T, null>(false)
}
