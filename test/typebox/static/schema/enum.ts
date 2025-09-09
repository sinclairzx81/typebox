import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// empty enum is never
Assert.IsExtendsNever<
  XStatic<{
    enum: []
  }>
>(true)

// should infer as union 1
Assert.IsExtendsMutual<
  XStatic<{
    enum: [1, 2, 3]
  }>,
  1 | 2 | 3
>(true)

// should infer as union 2
Assert.IsExtendsMutual<
  XStatic<{
    const: [1, 2, 4]
  }>,
  1 | 2 | 3
>(false)
