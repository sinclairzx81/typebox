import { Arguments } from 'typebox/system'
import { Assert } from 'test'

const Test = Assert.Context('System.Arguments')

Test('Should Arguments Match 1', () => {
  const Result = Arguments.Match([1], { 1: () => 'ok' })
  Assert.IsEqual(Result, 'ok')
})
Test('Should Arguments Match 2', () => {
  Assert.Throws(() => Arguments.Match([1, 2], { 1: () => 'ok' }))
})
