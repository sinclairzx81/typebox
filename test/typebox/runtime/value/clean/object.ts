import { Value } from 'typebox/value'
import { Type } from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Value.Clean.Object')

// ----------------------------------------------------------------
// Clean
// ----------------------------------------------------------------
Test('Should Clean 1', () => {
  const T = Type.Object({ x: Type.Number() })
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 2', () => {
  const T = Type.Object({ x: Type.Number() })
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 3', () => {
  const T = Type.Object({ x: Type.Number() })
  const R = Value.Clean(T, { x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clean 4', () => {
  const T = Type.Object({ x: Type.Number() })
  const R = Value.Clean(T, { x: null })
  Assert.IsEqual(R, { x: null })
})
// ----------------------------------------------------------------
// Nested
// ----------------------------------------------------------------
Test('Should Clean 5', () => {
  const T = Type.Object({
    x: Type.Object({
      y: Type.Number()
    })
  })
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 6', () => {
  const T = Type.Object({
    x: Type.Object({
      y: Type.Number()
    })
  })
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 7', () => {
  const T = Type.Object({
    x: Type.Object({
      y: Type.Number()
    })
  })
  const R = Value.Clean(T, { x: null })
  Assert.IsEqual(R, { x: null })
})
Test('Should Clean 8', () => {
  const T = Type.Object({
    x: Type.Object({
      y: Type.Number()
    })
  })
  const R = Value.Clean(T, { x: { y: null } })
  Assert.IsEqual(R, { x: { y: null } })
})
// ----------------------------------------------------------------
// Additional Properties
// ----------------------------------------------------------------
Test('Should Clean 9', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 10', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, {})
  Assert.IsEqual(R, {})
})
Test('Should Clean 11', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, { x: 1 })
  Assert.IsEqual(R, { x: 1 })
})
Test('Should Clean 12', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, { x: 1, y: 2 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
// ----------------------------------------------------------------
// Additional Properties Discard
// ----------------------------------------------------------------
Test('Should Clean 13', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, null)
  Assert.IsEqual(R, null)
})
Test('Should Clean 14', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, { k: '', d: null })
  Assert.IsEqual(R, { k: '' })
})
Test('Should Clean 15', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, { k: '', d: null, x: 1 })
  Assert.IsEqual(R, { k: '', x: 1 })
})
Test('Should Clean 16', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.String()
    }
  )
  const R = Value.Clean(T, { k: '', d: null, x: 1, y: 2 })
  Assert.IsEqual(R, { k: '', x: 1, y: 2 })
})
// ----------------------------------------------------------------
// Additional Properties: True
// ----------------------------------------------------------------
Test('Should Clean 17', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: true
    }
  )
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
// ----------------------------------------------------------------
// Additional Properties: Any
// ----------------------------------------------------------------
Test('Should Clean 18', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.Any()
    }
  )
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
// ----------------------------------------------------------------
// Additional Properties: Unknown
// ----------------------------------------------------------------
Test('Should Clean 19', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.Unknown()
    }
  )
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2, z: 3 })
})
// ----------------------------------------------------------------
// Additional Properties: Never
// ----------------------------------------------------------------
Test('Should Clean 20', () => {
  const T = Type.Object(
    {
      x: Type.Number(),
      y: Type.Number()
    },
    {
      additionalProperties: Type.Never()
    }
  )
  const R = Value.Clean(T, { x: 1, y: 2, z: 3 })
  Assert.IsEqual(R, { x: 1, y: 2 })
})
