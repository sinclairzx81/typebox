import { Type, Static } from '@sinclair/typebox'

const Box = Type.Box('foo', {
    Foo: Type.String()
})

const Foo = Type.Ref(Box, 'Foo')

type Foo = Static<typeof Foo>

