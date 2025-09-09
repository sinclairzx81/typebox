import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer unsized array
Assert.IsExtendsMutual<
  XStatic<{
    items: { type: 'string' }
  }>,
  string[]
>(true)

// should infer sized tuple
Assert.IsExtendsMutual<
  XStatic<{
    items: [{ type: 'string' }, { type: 'number' }]
  }>,
  [string, number]
>(true)
