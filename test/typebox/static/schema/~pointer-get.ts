import { Assert } from 'test'
import { type XPointerGet } from 'typebox/schema'

// ------------------------------------------------------------------
// Drill Down
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, ''>,
  {
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }
>(true)
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, '/x'>,
  {
    y: {
      z: [1, 2, 3, { name: string }]
    }
  }
>(true)
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, '/x/y'>,
  {
    z: [1, 2, 3, { name: string }]
  }
>(true)
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, '/x/y/z'>,
  [1, 2, 3, { name: string }]
>(true)
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, '/x/y/z/1'>,
  2
>(true)
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, '/x/y/z/3'>,
  { name: string }
>(true)
// ------------------------------------------------------------------
// Unresolvable
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      'hello': 12345
    }
  }, '/world'>,
  undefined
>(true)
// ------------------------------------------------------------------
// Escape
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      'hello~world': 12345
    }
  }, '/x/hello~0world'>,
  12345
>(true)

Assert.IsExtendsMutual<
  XPointerGet<{
    x: {
      'hello/world': 12345
    }
  }, '/x/hello~1world'>,
  12345
>(true)
