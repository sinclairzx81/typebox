import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import { Assert } from '../../assert/index'

describe('value/check/Recursive', () => {
  const T = Type.Recursive((This) =>
    Type.Object({
      id: Type.String(),
      nodes: Type.Array(This),
    }),
  )

  it('Should pass recursive', () => {
    const value = {
      id: 'A',
      nodes: [
        { id: 'B', nodes: [] },
        { id: 'C', nodes: [] },
        { id: 'D', nodes: [] },
      ],
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })

  it('Should fail recursive with invalid id', () => {
    const value = {
      id: 'A',
      nodes: [
        { id: 1, nodes: [] },
        { id: 'C', nodes: [] },
        { id: 'D', nodes: [] },
      ],
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })

  it('Should fail rec with invalid nodes', () => {
    const value = {
      id: 'A',
      nodes: [
        { id: 'B', nodes: 1 },
        { id: 'C', nodes: [] },
        { id: 'D', nodes: [] },
      ],
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })

  it('Should fail recursive with missing id', () => {
    const value = {
      id: 'A',
      nodes: [{ nodes: [] }, { id: 'C', nodes: [] }, { id: 'D', nodes: [] }],
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })

  it('Should fail rec with missing nodes', () => {
    const value = {
      id: 'A',
      nodes: [{ id: 'B' }, { id: 'C', nodes: [] }, { id: 'D', nodes: [] }],
    }
    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })

  // ------------------------------------------------------------------------
  // ref: https://github.com/sinclairzx81/typebox/issues/1302
  // ------------------------------------------------------------------------
  it('should not break when checking a circular structure #1', () => {
    const value = {
      id: '1',
      nodes: [],
    }

    // @ts-expect-error
    value.nodes[0] = value

    const result = Value.Check(T, value)
    Assert.IsEqual(result, true)
  })

  it('should not break when checking a circular structure #2', () => {
    const value = {
      id: 1,
      nodes: [],
    }

    // @ts-expect-error
    value.nodes[0] = value

    const result = Value.Check(T, value)
    Assert.IsEqual(result, false)
  })

  it('should not break when checking a circular structure #3', () => {
    const value = {
      a: '',
    }

    // @ts-expect-error
    value.b = value

    const T = Type.Recursive((This) =>
      Type.Object({
        a: Type.String(),
        b: This,
      }),
    )

    const result = Value.Check(T, value)

    Assert.IsEqual(result, true)
  })
})
