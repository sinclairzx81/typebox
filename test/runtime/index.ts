import { TypeSystemPolicy } from '@sinclair/typebox/system'

// ------------------------------------------------------------------
// Immutable Types:
// ------------------------------------------------------------------
TypeSystemPolicy.ImmutableTypes = true

import './compiler/index'
import './compiler-ajv/index'
import './errors/index'
import './system/index'
import './type/index'
import './value/index'
