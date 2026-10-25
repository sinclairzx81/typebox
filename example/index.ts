import * as Module from 'typebox/module'
import * as Type from 'typebox'
import System from 'typebox/system'
import Schema from 'typebox/schema'

System.Settings.Set({ enumerableKind: true })

// ------------------------------------------------------------------
// Done
// ------------------------------------------------------------------
// change: (Schema) Validator<Schema, Value> now Validator<Value>
// change: (Format) Clear method no longer exists. Use Reset() (intrinsic formats)

// done: (Format) Compiled Code references Format.IsEmail, Format.IsTime, etc.
// done: (Format) Extended formats set as External variable functions.
// done: (Serializer) Have a serializer, but needs testing
// done: (Spec) Added Module compiler to testsuite
// done: (Module) BuildInfo introspects for dependencies.
// done: (Module) Refine inlines as variable (via Serializer)
// done: (TypeModule) Should transform to { $defs: {} }
// done: (TypeModule) Should not build Generic types
// done: (TypeModule) Should not build Call types
// done: (Module) ModuleGuard implemented, but needs testing.
// done: (Module) Serializer (needs testing)
// done: Implement NameOf from BuildInfo, and Call rewrites.
// done: (Schema) Added context to ParseError class
// done: (Module) Invalid $defs names throw on Build()
// done: (Module) Unified Inference System (Canonical -> Annotation)
// done: (Module) Test Additional Formats
// done: (Module) Test Refine
// done: (Module) Full Coverage
// done: (Module) Advanced Canonical

// todo: Annotation and Canonical should be top-level functions
// todo: Recursion Tests
