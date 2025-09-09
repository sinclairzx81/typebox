import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer as expando
Assert.IsExtendsMutual<
  XStatic<{
    patternProperties: {
      'a': { type: 'number' }
    }
  }>,
  {
    [x: PropertyKey]: number
  }
>(true)
