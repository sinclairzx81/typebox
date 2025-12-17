import { Compile } from 'typebox/compile'
import System from 'typebox/system'
import Format from 'typebox/format'
import Schema from 'typebox/schema'
import Value from 'typebox/value'
import * as Type from 'typebox'
import { TSchema, TUnion } from 'typebox'
import Guard from 'typebox/guard'
import { TLiteral } from '../src/typebox.ts'

// TypeBox 1.1

// Remove Encode / Decode
// Remove Base
// Remove Mutate
// Rename ReadonlyType to ReadonlyObject

// Todo: Distribute Parameters on TCall
//       Rename extension keywords to `x-`
//       Support { [key: string]: number }
//       Support { [T, ...unknown[]] }