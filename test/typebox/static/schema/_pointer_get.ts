import { Assert } from 'test'
import { Pointer } from 'typebox/schema'

// ------------------------------------------------------------------
// Drill Down
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  Pointer.XPointerGet<{
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
  Pointer.XPointerGet<{
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
  Pointer.XPointerGet<{
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
  Pointer.XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, '/x/y/z'>,
  [1, 2, 3, { name: string }]
>(true)
Assert.IsExtendsMutual<
  Pointer.XPointerGet<{
    x: {
      y: {
        z: [1, 2, 3, { name: string }]
      }
    }
  }, '/x/y/z/1'>,
  2
>(true)
Assert.IsExtendsMutual<
  Pointer.XPointerGet<{
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
  Pointer.XPointerGet<{
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
  Pointer.XPointerGet<{
    x: {
      'hello~world': 12345
    }
  }, '/x/hello~0world'>,
  12345
>(true)

Assert.IsExtendsMutual<
  Pointer.XPointerGet<{
    x: {
      'hello/world': 12345
    }
  }, '/x/hello~1world'>,
  12345
>(true)
// ------------------------------------------------------------------
// Escape Order: RFC 6901 section 4 decodes '~1' before '~0', so '~01' is '~1', not '/'
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  Pointer.XPointerGet<{
    x: {
      '~1': 12345,
      '/': 'slash'
    }
  }, '/x/~01'>,
  12345
>(true)
Assert.IsExtendsMutual<
  Pointer.XPointerGet<{
    x: {
      'a~1b/0': 12345
    }
  }, '/x/a~01b~10'>,
  12345
>(true)
Assert.IsExtendsMutual<
  Pointer.XPointerGet<{
    x: {
      '~/x': 12345
    }
  }, '/x/~0~1x'>,
  12345
>(true)
