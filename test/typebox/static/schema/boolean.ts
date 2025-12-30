import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// boolean true allows anything, so unknown
Assert.IsExtendsMutual<
  XStatic<true>,
  unknown
>(true)
// boolean false disallows everything, so never
Assert.IsExtendsMutual<
  XStatic<false>,
  never
>(true)
