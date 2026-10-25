import * as Module from 'typebox/module'
import Type from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Module.Guard')

// ------------------------------------------------------------------
// ModuleGuard
//
// Tests for the guards which detect the kind of module target based
// on the input. We need to be mindful of {} which could mean either:
//
// 1. {} - empty schema
// 2. {} - empty type module
//
// We interpret {} to be an empty schema.
//
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Guards
// ------------------------------------------------------------------
Test('Should Guard 1', async () => {
  Assert.IsTrue(Module.Guard.IsJson({ type: 'string' }))
})
Test('Should Guard 2', async () => {
  Assert.IsTrue(Module.Guard.IsType(Type.String()))
})
Test('Should Guard 3', async () => {
  Assert.IsTrue(Module.Guard.IsJsonModule({
    $defs: { A: { type: 'string' } }
  }))
})
Test('Should Guard 4', async () => {
  Assert.IsTrue(Module.Guard.IsTypeModule(Type.Module({
    A: Type.String()
  })))
})
// ------------------------------------------------------------------
// Empty Object
// ------------------------------------------------------------------
Test('Should Guard 5', async () => {
  Assert.IsTrue(Module.Guard.IsJson({}))
})
Test('Should Guard 6', async () => {
  Assert.IsFalse(Module.Guard.IsJsonModule({}))
})
Test('Should Guard 7', async () => {
  Assert.IsFalse(Module.Guard.IsTypeModule({}))
})
Test('Should Guard 8', async () => {
  Assert.IsFalse(Module.Guard.IsType({}))
})
// ------------------------------------------------------------------
// Cross Rejection
// ------------------------------------------------------------------
Test('Should Guard 9', async () => {
  Assert.IsFalse(Module.Guard.IsJson(Type.String()))
})
Test('Should Guard 10', async () => {
  Assert.IsFalse(Module.Guard.IsType({ type: 'string' }))
})
Test('Should Guard 11', async () => {
  Assert.IsFalse(Module.Guard.IsJsonModule({ type: 'string' }))
})
Test('Should Guard 12', async () => {
  Assert.IsFalse(Module.Guard.IsTypeModule({ type: 'string' }))
})
Test('Should Guard 13', async () => {
  Assert.IsFalse(Module.Guard.IsJson({
    $defs: { A: { type: 'string' } }
  }))
})
// ------------------------------------------------------------------
// JsonModule Metadata
// ------------------------------------------------------------------
Test('Should Guard 14', async () => {
  Assert.IsTrue(Module.Guard.IsJsonModule({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $defs: { A: { type: 'string' } }
  }))
})
Test('Should Guard 15', async () => {
  Assert.IsTrue(Module.Guard.IsJsonModule({
    $defs: { A: { type: 'string' } },
    foo: 'bar'
  }))
})
Test('Should Guard 16', async () => {
  Assert.IsFalse(Module.Guard.IsJsonModule({
    $defs: { A: { type: 'string' } },
    type: 'object'
  }))
})
Test('Should Guard 17', async () => {
  // $defs alongside other vocabulary is a schema, not a module
  Assert.IsTrue(Module.Guard.IsJson({
    $defs: { A: { type: 'string' } },
    type: 'object'
  }))
})
// ------------------------------------------------------------------
// Order Independence: JsonModule
// ------------------------------------------------------------------
Test('Should Guard 18', async () => {
  Assert.IsTrue(Module.Guard.IsJsonModule({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $defs: { A: { type: 'string' } }
  }))
})
Test('Should Guard 19', async () => {
  Assert.IsTrue(Module.Guard.IsJsonModule({
    $defs: { A: { type: 'string' } },
    $schema: 'https://json-schema.org/draft/2020-12/schema'
  }))
})
Test('Should Guard 20', async () => {
  Assert.IsTrue(Module.Guard.IsJsonModule({
    foo: 'bar',
    $defs: { A: { type: 'string' } }
  }))
})
Test('Should Guard 21', async () => {
  Assert.IsFalse(Module.Guard.IsJsonModule({
    type: 'object',
    $defs: { A: { type: 'string' } }
  }))
})
// ------------------------------------------------------------------
// Order Independence: TypeModule
// ------------------------------------------------------------------
Test('Should Guard 22', async () => {
  Assert.IsTrue(Module.Guard.IsTypeModule({
    A: Type.String(),
    B: Type.Number()
  }))
})
Test('Should Guard 23', async () => {
  Assert.IsTrue(Module.Guard.IsTypeModule({
    B: Type.Number(),
    A: Type.String()
  }))
})
Test('Should Guard 24', async () => {
  // a module with a non-type member is not a type module
  Assert.IsFalse(Module.Guard.IsTypeModule({
    A: Type.String(),
    B: { type: 'number' }
  }))
})
Test('Should Guard 25', async () => {
  Assert.IsFalse(Module.Guard.IsTypeModule({
    B: { type: 'number' },
    A: Type.String()
  }))
})
