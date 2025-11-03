import { Pipeline } from 'typebox/value'
import { Assert } from 'test'

const Test = Assert.Context('Pipeline')

Test('Should Pipeline 1', () => {
  const pipeline = Pipeline()
    .Use((context, type, value) => (value as never) + 1) // 1
    .Use((context, type, value) => (value as never) + 1) // 2
    .Use((context, type, value) => (value as never) + 1) // 3
    .Use((context, type, value) => (value as never) + 1) // 4
    .Use((context, type, value) => (value as never) + 1) // 5
    .Use((context, type, value) => (value as never) + 1) // 6
    .Build()
  const result = pipeline({}, 0)
  Assert.IsEqual(result, 6)
})
Test('Should Pipeline 2 (Overload 1)', () => {
  const pipeline = Pipeline()
    .Use((context, type, value) => {
      Assert.HasPropertyKey(type, 'foo')
      Assert.IsEqual(value, 1)
      return value
    })
    .Use((context, type, value) => {
      Assert.HasPropertyKey(type, 'foo')
      Assert.IsEqual(value, 1)
      return value
    }).Build()
  pipeline({ foo: null }, 1)
})
Test('Should Pipeline 3 (Overload 2)', () => {
  const pipeline = Pipeline()
    .Use((context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.IsEqual(value, 1)
      return value
    })
    .Use((context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.IsEqual(value, 1)
      return value
    }).Build()
  pipeline({ foo: {} }, {}, 1)
})
Test('Should Pipeline 4 (Overload 3)', () => {
  const pipeline = Pipeline()
    .Use((context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.HasPropertyKey(type, 'bar')
      Assert.IsEqual(value, 1)
      return value
    })
    .Use((context, type, value) => {
      Assert.HasPropertyKey(context, 'foo')
      Assert.HasPropertyKey(type, 'bar')
      Assert.IsEqual(value, 1)
      return value
    }).Build()

  pipeline({ foo: {} }, { bar: null }, 1)
})
