import { Type } from '@sinclair/typebox'
import { ok, fail } from './validate'

describe('StringEnum', () => {
    
    it('Should validate when string emum has defined string values', () => {
        enum Kind {
            Foo = 'foo',
            Bar = 'bar'
        }
        const T = Type.StringEnum(Kind)
        ok(T, 'foo')
        ok(T, 'bar')
    })

    it('Should not validate when emum has defined string values and user passes numeric', () => {
        enum Kind {
            Foo = 'foo',
            Bar = 'bar'
        }
        const T = Type.StringEnum(Kind)
        fail(T, 0)
        fail(T, 1)
    })
})
