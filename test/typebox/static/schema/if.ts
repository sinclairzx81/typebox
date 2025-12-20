import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// if does not contribute to inference
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'number' }
  }>,
  unknown
>(true)
// else/then do not contribute if "if" clause is absent
Assert.IsExtendsMutual<
  XStatic<{
    else: { const: 1 }
    then: { const: 2 }
  }>,
  unknown
>(true)
// if/then should narrow as (if & then)
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'number' }
    then: { const: 1 }
  }>,
  1
>(true)
// if/then should narrow as (never) if illogical
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'string' }
    then: { const: 1 }
  }>,
  never
>(true)
// if/else should narrow to else
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'string' }
    else: { const: 1 }
  }>,
  1
>(true)
// if/then should never, but else clause is selected
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'string' }
    then: { const: 1 }
    else: { const: 2 }
  }>,
  2
>(true)
// else/then do not contribute if "if" clause is absent
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'string' }
    else: { const: 1 }
  }>,
  1
>(true)
// if/then/else illogical if/then, use else
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'string' }
    then: { const: 1 }
    else: { const: 2 }
  }>,
  2
>(true)
// nested if/then/else inference
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'number' }
    else: {
      if: { type: 'number' }
      else: { const: 1 }
      then: { const: 2 }
    }
    then: {
      if: { type: 'number' }
      else: { const: 3 }
      then: { const: 4 }
    }
  }>,
  1 | 2 | 3 | 4
>(true)
// multi variant nested if/then/else inference
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: ['number', 'string'] }
    else: {
      if: { type: 'number' }
      else: { const: 1 }
      then: { const: 2 }
    }
    then: {
      if: { type: 'string' }
      else: { const: 'A' }
      then: { const: 'B' }
    }
  }>,
  1 | 2 | 'A' | 'B'
>(true)
