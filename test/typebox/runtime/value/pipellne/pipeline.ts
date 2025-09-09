import { Pipeline } from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Pipeline')

Test('Should Pipeline 1', () => {
  const pipeline = Pipeline([
    (context, type, value) => (value as never) + 1, // 1
    (context, type, value) => (value as never) + 1, // 2
    (context, type, value) => (value as never) + 1, // 3
    (context, type, value) => (value as never) + 1, // 4
    (context, type, value) => (value as never) + 1, // 5
    (context, type, value) => (value as never) + 1 // 6
  ])
  const result = pipeline({}, 0)
  Assert.IsEqual(result, 6)
})
Test('Should Pipeline 2 (Overload 1)', () => {
  const pipeline = Pipeline([
    (context, type, value) => {
      Assert.HasPropertyKey(type, 'foo')
      Assert.IsEqual(value, 1)
      return value
    },
    (context, type, value) => {
      Assert.HasPropertyKey(type, 'foo')
      Assert.IsEqual(value, 1)
      return value
    }
  ])
  pipeline({ foo: null }, 1)
})
Test('Should Pipeline 3 (Overload 2)', () => {
  const pipeline = Pipeline([
    (context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.IsEqual(value, 1)
      return value
    },
    (context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.IsEqual(value, 1)
      return value
    }
  ])
  pipeline({ foo: {} }, {}, 1)
})
Test('Should Pipeline 4 (Overload 3)', () => {
  const pipeline = Pipeline([
    (context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.HasPropertyKey(type, 'bar')
      Assert.IsEqual(value, 1)
      return value
    },
    (context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.HasPropertyKey(type, 'bar')
      Assert.IsEqual(value, 1)
      return value
    }
  ])
  pipeline({ foo: {} }, { bar: null }, 1)
})
