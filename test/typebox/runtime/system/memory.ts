import { Memory, Settings } from 'typebox/system'
import { Assert } from 'test'

const Test = Assert.Context('System.Memory')

// ------------------------------------------------------------------
// Clone
// ------------------------------------------------------------------
Test('Should Clone 1', () => {
  const A = /xyz/
  const B = Memory.Clone(A)
  Assert.IsTrue(B instanceof RegExp)
  Assert.IsTrue(A !== B)
})
Test('Should Clone 2', () => {
  const A = [1, 2, 3]
  const B = Memory.Clone(A)
  Assert.IsEqual(B, A)
  Assert.IsTrue(A !== B)
})
Test('Should Clone 3', () => {
  const A = { x: 1, y: 2, z: 3 }
  const B = Memory.Clone(A)
  Assert.IsEqual(B, A)
  Assert.IsTrue(A !== B)
})
Test('Should Clone 4', () => {
  const A = 1
  const B = Memory.Clone(A)
  Assert.IsEqual(B, A)
  Assert.IsTrue(A === B)
})
Test('Should Clone 4', () => {
  const A = { '~guard': null }
  const B = Memory.Clone(A)
  Assert.IsEqual(B, A)
  Assert.IsTrue(A === B)
})
// ------------------------------------------------------------------
// Create
// ------------------------------------------------------------------
Test('Should Create 1', () => {
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
})
Test('Should Create 2', () => {
  Settings.Set({ immutableTypes: true })
  const A: any = Memory.Create({ x: 1 }, { y: 2 }, { z: 3 })
  Assert.IsEqual(A.x, 1)
  Assert.IsEqual(A.y, 2)
  Assert.IsEqual(A.z, 3)
  Assert.Throws(() => {
    A.x = 123
  })
  Settings.Reset()
})
