import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'
import { strictEqual } from 'assert'

describe('Pick', () => {
    it('Vector3 to Vector2', () => {
      const Vector3 = Type.Object({ 
          x: Type.Number(),
          y: Type.Number(),
          z: Type.Number()
      })
      const Vector2 = Type.Pick(Vector3, ['x', 'y'])
      ok(Vector2, { x: 1, y: 1 })
    })

    it('Options', () => {
        const Vector3 = Type.Object({
            x: Type.Number(),
            y: Type.Number(),
            z: Type.Number()
        }, { title: 'Vector3' })
        const Vector2 = Type.Pick(Vector3, ['x', 'y'], { title: 'Vector2' })
        strictEqual(Vector3.title, 'Vector3')
        strictEqual(Vector2.title, 'Vector2')
    })
})
