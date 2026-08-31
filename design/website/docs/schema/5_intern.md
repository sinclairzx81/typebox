# Schema.Intern

The Intern(...) function is a schema optimizer that deduplicates common schemas into a normalized referential schema structure. This function shares many aspects with the compiler optimization [Common Subexpression Elimination](https://en.wikipedia.org/wiki/Common_subexpression_elimination) (CSE), where common sub-expressions are hoisted and referenced. TypeBox implements a similar concept for JSON Schema, which can be used to compress schemas as well as target certain JavaScript engine-level optimizations. 

> ⚠️ The Intern(...) function is an experimental optimizer primarily aimed at optimizing TypeBox-aware schemas. The function does support most JSON Schema keywords; however, referential keywords such as `$recursiveRef`, `$dynamicRef`, and `$dynamicAnchor` are currently not supported. Schemas containing `$ref` must have resolvable targets or an error is thrown.

### Intern Transformation

The Intern(...) function will restructure a JSON Schema to use `$defs` and hash-content-addressable keys for each subschema. The resulting schema deduplicates structurally identical subschemas into shared `$defs` entries referenced via `$ref`, producing a more compact, referential representation of the original schema.

```typescript
// ------------------------------------------------------------------
// Duplication
// ------------------------------------------------------------------
const A = Type.Union([           // const A = {
  Type.Literal(1),               //   anyOf: [
  Type.Literal(1),               //     { type: "number", const: 1 },
  Type.Literal(2),               //     { type: "number", const: 1 }, // <-- duplicate
])                               //     { type: "number", const: 2 }
                                 //   ]
                                 // }

// ------------------------------------------------------------------
// Interned
// ------------------------------------------------------------------
const B = Schema.Intern(A)       // const B = {
                                 //   "$ref": "#/$defs/x-b8ef83810052edcf",
                                 //   "$defs": {
                                 //     "x-b4a949e1fd1fa2d7": { type: "number", const: 1 },
                                 //     "x-b225dd4d0666e2b6": { type: "number", const: 2 },
                                 //     "x-b8ef83810052edcf": {
                                 //       anyOf: [
                                 //         { "$ref": "#/$defs/x-b4a949e1fd1fa2d7" },
                                 //         { "$ref": "#/$defs/x-b4a949e1fd1fa2d7" },
                                 //         { "$ref": "#/$defs/x-b225dd4d0666e2b6" }
                                 //       ]
                                 //     }
                                 //   }
                                 // }
```

### Codegen and Engine Inlining

The Intern(...) function was written to explore V8's optimizing compiler tier (Maglev), which suggests inlining functions based on bytecode length. Because each hashed sub-schema compiles to a small function, individual functions may be more likely to fall within fast optimization thresholds (usually a bytecode length of around 27 to 30 depending on the runtime). Additionally, eliminating repeated check expressions may improve overall JIT performance for very large schematics.

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