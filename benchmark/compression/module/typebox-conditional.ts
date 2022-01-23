import { Conditional } from '@sinclair/typebox/conditional'
import { Type } from '@sinclair/typebox'

const T = Conditional.Extends(Type.String(), Type.String(), Type.String(), Type.String())
