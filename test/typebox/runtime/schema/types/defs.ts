import Schema from 'typebox/schema'
import { Assert } from 'test'

const Test = Assert.Context('Schema.IsDefs')

Test('Should Guard 1', () => {
  Assert.IsTrue(Schema.IsDefs({
    $defs: {}
  }))
})
Test('Should Guard 2', () => {
  Assert.IsTrue(Schema.IsDefs({
    $defs: {
      x: true,
      y: false,
      z: {}
    }
  }))
})
Test('Should Guard 3', () => {
  Assert.IsFalse(Schema.IsDefs({}))
})
Test('Should Guard 4', () => {
  Assert.IsFalse(Schema.IsDefs({
    $defs: {
      x: true,
      y: false,
      z: 1
    }
  }))
})
