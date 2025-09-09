import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer sized tuple
Assert.IsExtendsMutual<
  XStatic<{
    prefixItems: [{ type: 'string' }, { type: 'number' }]
  }>,
  [string, number]
>(true)
