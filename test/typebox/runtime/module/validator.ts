import * as NodeModule from 'node:module'
import * as Module from 'typebox/module'
import * as Format from 'typebox/format'
import * as Schema from 'typebox/schema'
import * as Type from 'typebox'

import { Assert } from 'test'

const Test = Assert.Context('Module.Validator')

// ------------------------------------------------------------------
// Validator
// ------------------------------------------------------------------
async function Validator(context: Record<PropertyKey, Schema.XSchema>, schema: Schema.XSchema): Promise<any> {
  const code = NodeModule.stripTypeScriptTypes(Module.Build(context, schema))
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  const validator = await import(url)
  return validator
}
// ------------------------------------------------------------------
// Parse
// ------------------------------------------------------------------
Test('Should Parse 1', async () => {
  const module = await Validator({}, Type.Literal(1))
  Assert.IsEqual(module.Parse(1), 1)
  Assert.Throws(() => module.Parse(0))
})
Test('Should Parse 2', async () => {
  const module = await Validator(
    {},
    Type.Module({
      A: Type.Literal(1)
    })
  )
  Assert.IsEqual(module.A.Parse(1), 1)
  Assert.Throws(() => module.A.Parse(0))
})
// ------------------------------------------------------------------
// Check
// ------------------------------------------------------------------
Test('Should Check 1', async () => {
  const module = await Validator(
    {},
    Type.Object({
      x: Type.Number(),
      y: Type.Number()
    })
  )
  Assert.IsTrue(module.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Check({ x: 1, y: null }))
})
Test('Should Check 2', async () => {
  const module = await Validator(
    {},
    Type.Module({
      Vector: Type.Object({
        x: Type.Number(),
        y: Type.Number()
      })
    })
  )
  Assert.IsTrue(module.Vector.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Vector.Check({ x: 1, y: null }))
})
Test('Should Check 3', async () => {
  const module = await Validator({}, {
    type: 'object',
    required: ['x', 'y'],
    properties: {
      x: { type: 'number' },
      y: { type: 'number' }
    }
  })
  Assert.IsTrue(module.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Check({ x: 1, y: null }))
})
Test('Should Check 4', async () => {
  const module = await Validator({}, {
    $defs: {
      Vector: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { type: 'number' },
          y: { type: 'number' }
        }
      }
    }
  })
  Assert.IsTrue(module.Vector.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Vector.Check({ x: 1, y: null }))
})
Test('Should Check 4', async () => {
  const module = await Validator({}, {
    $defs: {
      Vector: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { type: 'number' },
          y: { type: 'number' }
        }
      }
    }
  })
  Assert.IsTrue(module.Vector.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Vector.Check({ x: 1, y: null }))
})
Test('Should Check 5', async () => {
  const module = await Validator({}, null as never)
  Assert.IsFalse(module.Check(null))
})
// ------------------------------------------------------------------
// Context
// ------------------------------------------------------------------
Test('Should Check 6', async () => {
  const module = await Validator(
    { Scalar: Type.Number() },
    Type.Object({
      x: Type.Ref('Scalar'),
      y: Type.Ref('Scalar')
    })
  )
  Assert.IsTrue(module.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Check({ x: 1, y: null }))
})
Test('Should Check 7', async () => {
  const module = await Validator(
    { Scalar: Type.Number() },
    Type.Module({
      Vector: Type.Object({
        x: Type.Ref('Scalar'),
        y: Type.Ref('Scalar')
      })
    })
  )
  Assert.IsTrue(module.Vector.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Vector.Check({ x: 1, y: null }))
})
Test('Should Check 8', async () => {
  const module = await Validator({ Scalar: { type: 'number' } }, {
    type: 'object',
    required: ['x', 'y'],
    properties: {
      x: { $ref: 'Scalar' },
      y: { $ref: 'Scalar' }
    }
  })
  Assert.IsTrue(module.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Check({ x: 1, y: null }))
})
Test('Should Check 9', async () => {
  const module = await Validator({ Scalar: { type: 'number' } }, {
    $defs: {
      Vector: {
        type: 'object',
        required: ['x', 'y'],
        properties: {
          x: { $ref: 'Scalar' },
          y: { $ref: 'Scalar' }
        }
      }
    }
  })
  Assert.IsTrue(module.Vector.Check({ x: 1, y: 2 }))
  Assert.IsFalse(module.Vector.Check({ x: 1, y: null }))
})
// ------------------------------------------------------------------
// NonRepresentable (Coverage)
// ------------------------------------------------------------------
Test('Should Check 10', async () => {
  const module = await Validator({}, Type.Generic([], Type.String()))
  Assert.IsFalse(module.Check(0)) // type modules use Never() on NonRepresentable
})
Test('Should Check 11', async () => {
  const module = await Validator({}, Type.Deferred('Any', [], {}))
  Assert.IsFalse(module.Check(0)) // type modules use Never() on NonRepresentable
})
Test('Should Check 12', async () => {
  const module = await Validator({}, Type.Call(Type.Any(), []))
  Assert.IsFalse(module.Check(0)) // type modules use Never() on NonRepresentable
})
Test('Should Check 13', async () => {
  const module = await Validator(
    {},
    Type.Module({
      Vector: Type.Generic([], Type.String())
    })
  )
  Assert.NotHasPropertyKey(module, 'Vector')
})
Test('Should Check 14', async () => {
  const module = await Validator(
    {},
    Type.Module({
      Vector: Type.Deferred('Any', [], {})
    })
  )
  Assert.NotHasPropertyKey(module, 'Vector')
})
Test('Should Check 15', async () => {
  const module = await Validator(
    {},
    Type.Module({
      Vector: Type.Call(Type.Any(), [])
    })
  )
  Assert.NotHasPropertyKey(module, 'Vector')
})
// ------------------------------------------------------------------
// JsonModule Guards
// ------------------------------------------------------------------
Test('Should Check 16', async () => {
  const module = await Validator({}, {
    $defs: {
      A: { type: 'number' }
    }
  })
  Assert.IsTrue(module.A.Check(0))
  Assert.IsFalse(module.A.Check(null))
})
Test('Should Check 17', async () => {
  const module = await Validator({}, {
    $schema: '...', // allowed key
    description: '...', // allowed
    $defs: {
      A: { type: 'number' }
    }
  })
  Assert.IsTrue(module.A.Check(0))
  Assert.IsFalse(module.A.Check(null))
})
Test('Should Check 18', async () => {
  const module = await Validator({}, {
    $defs: { A: { type: 'number' } },
    $ref: '#/$defs/A'
  })
  Assert.IsTrue(module.Check(1))
  Assert.IsFalse(module.Check(null))
  Assert.NotHasPropertyKey(module, 'A')
})
Test('Should Check 19', async () => {
  const module = await Validator({}, {
    type: 'null', // disallowed key
    $defs: {
      A: { type: 'number' }
    }
  })
  Assert.IsTrue(module.Check(null))
  Assert.IsFalse(module.Check(1))
})
// ------------------------------------------------------------------
// Conditional Modules (Coverage)
// ------------------------------------------------------------------
Test('Should Check 20', async () => {
  // UseGuard
  const module = await Validator(
    {},
    Type.Module({
      A: Type.String({ minLength: 4 })
    })
  )
  Assert.IsTrue(module.A.Check('xxxx'))
  Assert.IsFalse(module.A.Check('xxx'))
})
Test('Should Check 21', async () => {
  // UseGlobalGuard | UseHashing
  const module = await Validator(
    {},
    Type.Module({
      A: Type.Array(Type.Any(), { uniqueItems: true })
    })
  )
  Assert.IsTrue(module.A.Check([1, 2, 3, 4]))
  Assert.IsFalse(module.A.Check([1, 1, 2, 2]))
})
Test('Should Check 22', async () => {
  // UseIdna
  const module = await Validator(
    {},
    Type.Module({
      A: Type.String({ format: 'hostname' })
    })
  )
  Assert.IsTrue(module.A.Check('domain.com'))
  Assert.IsFalse(module.A.Check(null))
})
Test('Should Check 23', async () => {
  // UseCheckContent
  const module = await Validator(
    {},
    Type.Module({
      A: Type.Intersect([
        Type.Object({ x: Type.Number() }),
        Type.Object({ y: Type.Number() })
      ], { unevaluatedProperties: false })
    })
  )
  Assert.IsTrue(module.A.Check({ x: 1, y: 1 }))
  Assert.IsFalse(module.A.Check({ x: 1, y: 1, z: 3 }))
})
// ------------------------------------------------------------------
// Rewrite Calls Based on Definition Name (Coverage)
// ------------------------------------------------------------------
Test('Should Check 24', async () => {
  const module = await Validator({}, Type.Module({ Hashing: Type.Number() }))
  Assert.IsTrue(module.Hashing.Check(0))
  Assert.IsFalse(module.Hashing.Check(null))
})
Test('Should Check 25', async () => {
  const module = await Validator({}, Type.Module({ Guard: Type.Number() }))
  Assert.IsTrue(module.Guard.Check(0))
  Assert.IsFalse(module.Guard.Check(null))
})
Test('Should Check 26', async () => {
  const module = await Validator({}, Type.Module({ Format: Type.Number() }))
  Assert.IsTrue(module.Format.Check(0))
  Assert.IsFalse(module.Format.Check(null))
})
// ------------------------------------------------------------------
// Formats
// ------------------------------------------------------------------
Test('Should Check 27', async () => {
  Format.Set('foo', (value) => value === 'foo')
  const validator = await Validator({}, { format: 'foo' })
  Assert.IsTrue(validator.Check('foo'))
  Assert.IsFalse(validator.Check('bar'))
  Format.Reset()
})
// ------------------------------------------------------------------
// Refine
// ------------------------------------------------------------------
Test('Should Check 28', async () => {
  const A = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date)
  const validator = await Validator({}, A)
  Assert.IsTrue(validator.Check(new Date()))
  Assert.IsFalse(validator.Check(null))
})
Test('Should Check 29', async () => {
  const A = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date)
  const B = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date)
  const C = Type.Refine(Type.Unsafe<Date>({}), (value) => value instanceof Date)
  const validator = await Validator({}, Type.Tuple([A, B, C]))
  Assert.IsTrue(validator.Check([new Date(), new Date(), new Date()]))
  Assert.IsFalse(validator.Check(null))
})
