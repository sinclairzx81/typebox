import { TypeSystemPolicy } from '@sinclair/typebox/system'

// ------------------------------------------------------------------
// InstanceMode: Freeze (Detect Unintended Side Effects)
// ------------------------------------------------------------------
TypeSystemPolicy.InstanceMode = 'freeze'

import './compiler/index'
import './compiler-ajv/index'
import './errors/index'
import './syntax/index'
import './system/index'
import './type/index'
import './value/index'
