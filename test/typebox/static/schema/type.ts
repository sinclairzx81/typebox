import { Assert } from 'test'
import { type XStatic } from 'typebox/schema'

// ------------------------------------------------------------------
// JSONSchema: Object
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'object'
  }>,
  object
>(true)
// ------------------------------------------------------------------
// JSONSchema: Array
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'array'
  }>,
  {}
>(true)
// ------------------------------------------------------------------
// JSONSchema: Boolean
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'boolean'
  }>,
  boolean
>(true)
// ------------------------------------------------------------------
// JSONSchema: Integer
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'integer'
  }>,
  number
>(true)
// ------------------------------------------------------------------
// JSONSchema: Number
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'number'
  }>,
  number
>(true)
// ------------------------------------------------------------------
// JSONSchema: Null
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'null'
  }>,
  null
>(true)
// ------------------------------------------------------------------
// JSONSchema: String
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'string'
  }>,
  string
>(true)

// ------------------------------------------------------------------
// XSchema: BigInt
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'bigint'
  }>,
  bigint
>(true)
// ------------------------------------------------------------------
// XSchema: Symbol
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'symbol'
  }>,
  symbol
>(true)
// ------------------------------------------------------------------
// XSchema: Undefined
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'undefined'
  }>,
  undefined
>(true)
// ------------------------------------------------------------------
// XSchema: Void
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'void'
  }>,
  void
>(true)
// ------------------------------------------------------------------
// XSchema-Structural-Object: AsyncIterator
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'asyncIterator'
  }>,
  {}
>(true)
// ------------------------------------------------------------------
// XSchema-Structural-Object: Constructor
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'constructor'
  }>,
  {}
>(true)
// ------------------------------------------------------------------
// XSchema-Structural-Object: Function
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'function'
  }>,
  {}
>(true)
// ------------------------------------------------------------------
// XSchema-Structural-Object: Iterator
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: 'iterator'
  }>,
  {}
>(true)
// ------------------------------------------------------------------
// Fallthrough: ???
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: '???'
  }>,
  unknown
>(true)
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Assert.IsExtendsMutual<
  XStatic<{
    type: ['string', 'number', 'boolean']
  }>,
  string | number | boolean
>(true)
