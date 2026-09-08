# Schema.Intern

The Intern(...) function is a JSON Schema optimizer that transforms schematics into full referential schema structures with the same validation semantics as the original. It is similar in concept to [Common Subexpression Elimination](https://en.wikipedia.org/wiki/Common_subexpression_elimination) (CSE), where common subexpressions (subschemas in this case) are hoisted and globally referenced. TypeBox applies this concept to JSON Schema, enabling options for large schema compression.

> ⚠️ The Intern(...) function is considered experimental. The function is tested against TypeBox-aware schematics and supports all JSON Schema keywords; however, full JSON Schema compliance testing is not yet complete. The recommendation is to use this function with Type.* and Script schematics only.

### Intern Transform

The Intern(...) function restructures a JSON Schema to use $defs and content-addressed keys for each subschema. The resulting schema deduplicates structurally identical subschemas into shared $defs entries referenced via $ref, producing a compact, referential representation of the original schema. This can significantly reduce redundancy for large schemas.

```typescript
// ------------------------------------------------------------------
// Referential JavaScript Types Produce Schema Duplication
// ------------------------------------------------------------------
const Vector = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number()
})
const Basis = Type.Object({           // const Basis = {
  x: Vector,                          //   type: "object",
  y: Vector,                          //   required: [ "x", "y", "z" ],
  z: Vector                           //   properties: {
})                                    //     x: {
                                      //       type: "object",
                                      //       required: [ "x", "y", "z" ],
                                      //       properties: {
                                      //         x: { type: "number" },
                                      //         y: { type: "number" },
                                      //         z: { type: "number" }
                                      //       }
                                      //     },
                                      //     y: {
                                      //       type: "object",
                                      //       required: [ "x", "y", "z" ],
                                      //       properties: {
                                      //         x: { type: "number" },
                                      //         y: { type: "number" },
                                      //         z: { type: "number" }
                                      //       }
                                      //     },
                                      //     z: {
                                      //       type: "object",
                                      //       required: [ "x", "y", "z" ],
                                      //       properties: {
                                      //         x: { type: "number" },
                                      //         y: { type: "number" },
                                      //         z: { type: "number" }
                                      //       }
                                      //     }
                                      //   }
                                      // }

// ------------------------------------------------------------------
// The Intern function Eliminates Schema Redundancy
// ------------------------------------------------------------------
const Result = Schema.Intern(Basis)   // const Result = {
                                      //   "$ref": "#/$defs/x-cb2f2e06bb2d475a",
                                      //   "$defs": {
                                      //     "x-b3d1b3fb56d0fb6e": { type: "number" },
                                      //     "x-f0586253b656ad7e": {
                                      //       type: "object",
                                      //       required: [ "x", "y", "z" ],
                                      //       properties: {
                                      //         x: { "$ref": "#/$defs/x-b3d1b3fb56d0fb6e" },
                                      //         y: { "$ref": "#/$defs/x-b3d1b3fb56d0fb6e" },
                                      //         z: { "$ref": "#/$defs/x-b3d1b3fb56d0fb6e" }
                                      //       }
                                      //     },
                                      //     "x-cb2f2e06bb2d475a": {
                                      //       type: "object",
                                      //       required: [ "x", "y", "z" ],
                                      //       properties: {
                                      //         x: { "$ref": "#/$defs/x-f0586253b656ad7e" },
                                      //         y: { "$ref": "#/$defs/x-f0586253b656ad7e" },
                                      //         z: { "$ref": "#/$defs/x-f0586253b656ad7e" }
                                      //       }
                                      //     }
                                      //   }
                                      // }
```

### Experimental Bytecode Inlining

The Intern(...) function was written to explore V8's optimizing compiler tier (Maglev), which inlines functions based on bytecode length. Interned schematics tend to produce smaller functions that are more likely to fall within fast optimization thresholds (typically a bytecode length around 27 to 30 depending on the runtime), and the reduced redundancy means less code for the engine to JIT overall (so faster JIT). The function can thus be thought of as an optional optimizing transform for TypeBox's compiler.

You can check the [Maglev](https://github.com/v8/v8/blob/692983bf16608a60b3be9876e5cce921fbbf3753/src/flags/flag-definitions.h#L618-L637) inlining thresholds with the following:

```bash
$ node --v8-options | grep max-inlined-bytecode-size-small
#  --max-inlined-bytecode-size-small (maximum size of bytecode considered for small function inlining)
#        type: int  default: --max-inlined-bytecode-size-small=27
```

The following example shows the transform and subsequent code generation with consideration to Maglev.

```typescript
// ------------------------------------------------------------------
// Schema A
//
// When passing a non-referential schema to Schema.Compile(...), the 
// result will be a single function with a large logical expression. 
// Because a single expression may be long and complex, inlining 
// optimizers may skip optimizations based on the engine's observed 
// bytecode length.
//
// ------------------------------------------------------------------

const A = Type.Object({      // const A = {
  x: Type.String(),          //   type: "object",
  y: Type.Number(),          //   required: [ "x", "y", "z" ],
  z: Type.Boolean()          //   properties: {
})                           //     x: { type: "string" },
                             //     y: { type: "number" },
                             //     z: { type: "boolean" }
                             //   }
                             // }

// Expression may be considered too large for optimization.

Schema.Build(A).Functions()  // const check_0 = ((value) => ((typeof value === "object" 
                             //   && value !== null && !(Array.isArray(value))) 
                             //   && ((("x" in value && "y" in value) && "z" in value) 
                             //   && ((typeof value.x === "string" && Number.isFinite(value.y)) 
                             //   && typeof value.z === "boolean"))))
```

The following shows the generated emit after an Intern(...) transformation.

```typescript
// ------------------------------------------------------------------
// Schema B
//
// The following schema is A's Intern(...) transformation
// ------------------------------------------------------------------

const B = Schema.Intern(A)   // const B = {
                             //   "$ref": "#/$defs/x-32ee5a8c5a17e144",
                             //   "$defs": {
                             //     "x-003a03cdd3301d5a": { type: "string" },
                             //     "x-b3d1b3fb56d0fb6e": { type: "number" },
                             //     "x-7995c3fcb3fc994d": { type: "boolean" },
                             //     "x-32ee5a8c5a17e144": {
                             //       type: "object",
                             //       required: [ "x", "y", "z" ],
                             //       properties: {
                             //         x: { "$ref": "#/$defs/x-003a03cdd3301d5a" },
                             //         y: { "$ref": "#/$defs/x-b3d1b3fb56d0fb6e" },
                             //         z: { "$ref": "#/$defs/x-7995c3fcb3fc994d" }
                             //       }
                             //     }
                             //   }
                             // }

// ------------------------------------------------------------------
// Optimization
//
// The core idea behind Intern(...) is to reduce the bytecode length 
// of expressions such that engine optimizers will attempt to inline 
// them. To make this more likely, Intern(...) will cause the original 
// (A) check_0 function to expand into 5 distinct functions, one for 
// each hashed definition. 
// 
// For check_1, the length of the object expression has been reduced, 
// making it more likely an optimizer will attempt to inline. The 
// string, number, and boolean checks have been moved to check_2, 
// check_3, and check_4 respectively, where an engine may attempt to 
// inline them back into check_1.
//
// ------------------------------------------------------------------

Schema.Build(B).Functions()    // const check_0 = ((value) => check_1(value))
                               // const check_1 = ((value) => ((typeof value === "object" 
                               //   && value !== null 
                               //   && !(Array.isArray(value))) 
                               //   && ((("x" in value && "y" in value) && "z" in value) 
                               //   && ((check_2(value.x) && check_3(value.y)) 
                               //   && check_4(value.z)))))
                               //
                               // const check_2 = ((value) => typeof value === "string")
                               // const check_3 = ((value) => Number.isFinite(value))
                               // const check_4 = ((value) => typeof value === "boolean")
```