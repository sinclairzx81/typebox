import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// should infer as expando

type T = XStatic<{
  patternProperties: {
    'a': { type: 'number' }
  }
}>

Assert.IsExtendsMutual<T, { [x: string]: number }>(true)
