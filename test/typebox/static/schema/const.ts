import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

Assert.IsExtendsMutual<
  XStatic<{
    const: 1
  }>,
  1
>(true)

Assert.IsExtendsMutual<
  XStatic<{
    const: 1
  }>,
  2
>(false)
