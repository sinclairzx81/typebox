import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// 'if' alone does not contribute to inference
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'number' }
  }>,
  unknown
>(true)
// 'else/then' do not contribute if "if" clause not present
Assert.IsExtendsMutual<
  XStatic<{
    else: { const: 1 }
    then: { const: 2 }
  }>,
  unknown
>(true)
// 'if/then' should narrow as (if & then)
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
    then: {
      if: { type: 'number' }
      else: { const: 3 }
      then: { const: 4 }
    }
    else: {
      if: { type: 'number' }
      else: { const: 1 }
      then: { const: 2 }
    }
  }>,
  4
>(true)
// multi variant nested if/then/else inference
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: ['number', 'string'] }
    then: {
      if: { type: 'string' }
      else: { const: 'A' }
      then: { const: 'B' }
    }
    else: {
      if: { type: 'number' }
      else: { const: 1 }
      then: { const: 2 }
    }
  }>,
  'B'
>(true)
// when else arm unreachable, so we evaluate for then only
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'number' }
    then: { const: 1 }
    else: { const: 2 } // anything reaching else would NOT be number, thus
    // could never satisfy the constraint of 2.
  }>,
  1
>(true)
// when else arm is reachable.
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'number' }
    then: { const: 1 }
    else: { const: 'hello' } // anything NOT number is reachable
  }>,
  1 | 'hello'
>(true)
// when if arm is illogical, infer as else.
Assert.IsExtendsMutual<
  XStatic<{
    if: { type: 'string' }
    then: { const: 1 } // illogical
    else: { const: 2 }
  }>,
  2
>(true)
// should be distributive over union
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
    required: ['x']
    properties: {
      x: { type: 'number' }
    }
    if: {
      properties: {
        x: { const: 1 }
      }
    }
    then: {
      required: ['y']
      properties: {
        y: { const: 2 }
      }
    }
    else: {
      required: ['z']
      properties: {
        z: { const: 3 }
      }
    }
  }>,
  {
    z: 3
    x: number
  } | {
    x: 1
    y: 2
  }
>(true)
