# Module.Type

TypeBox modules are both runtime validators and static types. They can be used as standalone validators and as annotations for values and function arguments.

## Usage

The following shows runtime and static usage of a compiled module type.

```typescript
import { Vector } from './geometry.ts'

// ------------------------------------------------------------------
// Variable Annotation
// ------------------------------------------------------------------

const A: Vector = { x: 1, y: 2, z: 3 }

// ------------------------------------------------------------------
// Parameter and ReturnType Annotation
// ------------------------------------------------------------------

function add(a: Vector, b: Vector): Vector {
  return Vector.Parse({
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  })
}

// ------------------------------------------------------------------
// Validator
// ------------------------------------------------------------------

const result = add(
  Vector.Parse({ x: 1, y: 2, z: 3 }),
  Vector.Parse({ x: 1, y: 2, z: 3 }),
)
```

## Interface

All module types are implementations of the following Validator interface, which is available via submodule import.

```typescript
import { type Validator } from 'typebox/module'
```

## Layout

The following shows the high-level layout and type organization of the geometry module. Each module embeds a structurally identical copy of the Validator interface, so the generated output has no dependency on TypeBox. Code is generated such that the static type name matches the Validator implementation name, which enables the type to be used in both runtime and annotation positions.

```typescript
// ------------------------------------------------------------------
// Generated ESM Module
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Validator (Fixed)
// ------------------------------------------------------------------
export interface Validator<Value extends unknown = unknown> {
  Context(): Record<string, Record<string, unknown> | boolean>
  Schema(): Record<string, unknown> | boolean
  Check(value: unknown): value is Value
  Parse(value: unknown): Value
}

// ------------------------------------------------------------------
// Vector (Generated)
// ------------------------------------------------------------------

declare namespace Namespace { export type Vector = { x: number, y: number, z: number } }
export type Vector = Namespace.Vector
export const Vector: Validator<Vector> = (() => {
  return {
    Context: () => {...},
    Schema: () => {...},
    Check: (value: unknown): value is Type => {...},
    Parse: (value: unknown): Type => {...}
  }
})();

// ------------------------------------------------------------------
// Export (Generated)
// ------------------------------------------------------------------

const Namespace = { Vector }
export default Namespace

```