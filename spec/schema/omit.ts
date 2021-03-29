import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('Omit', () => {
    it('Vector3 to Vector2', () => {
      const Vector3 = Type.Object({ 
          x: Type.Number(),
          y: Type.Number(),
          z: Type.Number()
      })
      const Vector2 = Type.Omit(Vector3, ['z'])
      ok(Vector2, { x: 1, y: 1 })
    })
  
    it('User', () => {
      const User = Type.Object({
        id: Type.Readonly(Type.Integer()),
        name: Type.String({ default: null }),
        email: Type.String({ default: undefined }),
      });
      const PartialUser = Type.Omit(User, ['id'])
      ok(PartialUser, { name: 'user', email: 'user@example.com' })
    })
})
