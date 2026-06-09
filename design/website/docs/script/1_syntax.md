# Script.Syntax

TypeBox is designed to be a programmable DSL for the JSON Schema specification. It uses JSON Schema as an intermediate representation for TypeScript types (tentatively named Type IR), and evaluates it using the type semantics of the TypeScript language.

The TypeBox Script function is the DSL interface. It accepts TypeScript type-level expressions and resolves them to their TypeBox equivalents. It supports interfaces, type aliases, conditional types, mapped types, indexed access, generics, and union distribution. The Script function returns parsed TypeBox types that can be inferred with `Static<T>`

## Types

Script has support for most TypeScript types and structural constructs. Each type will map into its corresponding TypeBox representation, which can be serialized as JSON Schema or compiled into a validator.

```typescript
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
const T0 = Type.Script('1')                             // TLiteral<1>
const T1 = Type.Script('true')                          // TLiteral<true>
const T2 = Type.Script('"hello"')                       // TLiteral<"hello">
const T3 = Type.Script('10000n')                        // TLiteral<10000n>

// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
const T4 = Type.Script('`hello${1|2}`')                 // TTemplateLiteral<'^hello(1|2)$'>

// ------------------------------------------------------------------
// JsonSchema
// ------------------------------------------------------------------
const T5  = Type.Script('any')                          // TAny
const T6  = Type.Script('unknown')                      // TUnknown
const T7  = Type.Script('never')                        // TNever
const T8  = Type.Script('boolean')                      // TBoolean
const T9  = Type.Script('integer')                      // TInteger
const T10 = Type.Script('number')                       // TNumber
const T11 = Type.Script('string')                       // TString
const T12 = Type.Script('null')                         // TNull

// ------------------------------------------------------------------
// JsonSchema Extensions
// ------------------------------------------------------------------
const T13 = Type.Script('bigint')                        // TBigInt
const T14 = Type.Script('symbol')                        // TSymbol 
const T15 = Type.Script('undefined')                     // TUndefined
const T16 = Type.Script('void')                          // TVoid

// ------------------------------------------------------------------
// Structural
// ------------------------------------------------------------------
const T17 = Type.Script('{ x: number }')                 // TObject<{ x: TNumber }>
const T18 = Type.Script('[1, 2]')                        // TTuple<[TLiteral<1>, TLiteral<2>]>
const T19 = Type.Script('number[]')                      // TArray<TNumber>

// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
const T20 = Type.Script('{ x: 1 } & { y: 2 }')           // TIntersect<[
                                                         //   TObject<{
                                                         //     x: TLiteral<1>
                                                         //   }>,
                                                         //   TObject<{
                                                         //     y: TLiteral<2>
                                                         //   }>,
                                                         // ]>

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
const T21 = Type.Script('{ x: 1 } | { y: 2 }')           // TUnion<[
                                                         //   TObject<{
                                                         //     x: TLiteral<1>
                                                         //   }>,
                                                         //   TObject<{
                                                         //     y: TLiteral<2>
                                                         //   }>,
                                                         // ]>

// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
const T22 = Type.Script(`(a: number, b: number) => number`)

                                                        // TFunction<[TNumber, TNumber], TNumber>

// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
const T23 = Type.Script(`new (a: number, b: number) => { 
  foo: (x: string) => void
  bar: (x: string) => void
  baz: (x: string) => void
}`)                                                      // TConstructor<[TNumber, TNumber], TObject<{
                                                         //   foo: TFunction<[TString], TVoid>
                                                         //   bar: TFunction<[TString], TVoid>
                                                         //   baz: TFunction<[TString], TVoid>
                                                         // }>>
```

## Type Expressions

Script provides support for most TypeScript type-level expressions.

```typescript
// ------------------------------------------------------------------
// Conditional
// ------------------------------------------------------------------
const T0 = Type.Script(`1 extends 2 ? true : false`)     // TFalse
const T1 = Type.Script('1 extends infer A ? [A]: never') // TTuple<[TLiteral<1>]>


// ------------------------------------------------------------------
// Mapped
// ------------------------------------------------------------------
const T2 = Type.Script(`{
  [K in keyof 'x' | 'y' | 'z']: number
}`)                                                      // TObject<{
                                                         //   x: TNumber,
                                                         //   y: TNumber,
                                                         //   z: TNumber
                                                         // }>

const T3 = Type.Script(`{
  [K in keyof 'x' | 'y' | 'z' as Uppercase<K>]?: number
}`)                                                      // TObject<{
                                                         //   X: TOptional<TNumber>,
                                                         //   Y: TOptional<TNumber>,
                                                         //   Z: TOptional<TNumber>
                                                         // }>

// ------------------------------------------------------------------
// KeyOf
// ------------------------------------------------------------------
const T4 = Type.Script(`keyof { x: number, y: number }`) // TUnion<[
                                                         //   TLiteral<'x'>,
                                                         //   TLiteral<'y'>
                                                         // ]>

// ------------------------------------------------------------------
// Indexed
// ------------------------------------------------------------------
const T5 = Type.Script(`[1, 2, 3][2]`)                   // TLiteral<3>
const T6 = Type.Script(`{ x: number }['x']`)             // TNumber

// ------------------------------------------------------------------
// Generic + Invoke
// ------------------------------------------------------------------
const T7 = Type.Script(`<T> = [T, T, T]`)                // TGeneric<...>

const T8 = Type.Script({ T7 }, `T7<1>`)                  // TTuple<[
                                                         //   TLiteral<1>,
                                                         //   TLiteral<1>,
                                                         //   TLiteral<1>,
                                                         // ]>

// ------------------------------------------------------------------
// Dependent
// ------------------------------------------------------------------
const T9 = Type.Script(`if number then 1`)               // TDependent<
                                                         //   TNumber,
                                                         //   TLiteral<1>,
                                                         //   TUnknown
                                                         // >

const T10 = Type.Script(`if number then 1 else string`)  // TDependent<
                                                         //   TNumber,
                                                         //   TLiteral<1>,
                                                         //   TString
                                                         // >
const T11 = Type.Script(`{
  x: number
  y: number
} & if { x: 1 } then { y: 1 }`)                          // TIntersect<[
                                                         //   TObject<{
                                                         //     x: TNumber,
                                                         //     y: TNumber,
                                                         //   }>, 
                                                         //   TDependent<
                                                         //     TObject<{
                                                         //       x: TLiteral<1>,
                                                         //     }>,
                                                         //     TObject<{
                                                         //       y: TLiteral<2>,
                                                         //     }>,
                                                         //     TUnknown
                                                         //   >
                                                         // ]>
```

## Type Augmentation

Script supports extended syntax to augment types with constraints and annotations.

```typescript
// ------------------------------------------------------------------
// With Types 
// ------------------------------------------------------------------
const T0 = Type.Script(`string with {
  format: 'email'
  description: 'An email address' 
}`)                                                      // TWith<TString, {
                                                         //   format: 'email',
                                                         //   description: 'An email address',
                                                         // }>


const T1 = Type.Script(`{ 
  x: number with { minimum: 0, maximum: 1 },
  y: number with { minimum: 0, maximum: 1 },
  z: number with { minimum: 0, maximum: 1 },
} with { additionalProperties: false }`)                 // TWith<TObject<{
                                                         //   x: TWith<TNumber, {
                                                         //     minimum: 0;
                                                         //     maximum: 1;
                                                         //   }>;
                                                         //   y: TWith<TNumber, {
                                                         //     minimum: 0;
                                                         //     maximum: 1;
                                                         //   }>;
                                                         //   z: TWith<TNumber, {
                                                         //     minimum: 0;
                                                         //     maximum: 1;
                                                         //   }>;
                                                         // }>, {
                                                         //   additionalProperties: false;
                                                         // }>
```

## Built In Types

Script includes support for most TypeScript utility types and intrinsics.

```typescript
// ------------------------------------------------------------------
// Utility Types 
// ------------------------------------------------------------------
const T0  = Type.Script(`Partial<{ x: number }>`)
const T1  = Type.Script(`Required<{ x: number }>`)
const T2  = Type.Script(`Readonly<{ x: number }>`)
const T3  = Type.Script(`Pick<{ x: number, y: number }, 'x'>`)
const T4  = Type.Script(`Omit<{ x: number, y: number }, 'x'>`)
const T5  = Type.Script(`NonNullable<string | null>`)
const T6  = Type.Script('Exclude<1 | 2 | 3, 1 | 2>')
const T7  = Type.Script('Extract<1 | 2 | 3, 1 | 2>')
const T8  = Type.Script('ConstructorParameters<new (x: number) => {}>')
const T9  = Type.Script('Parameters<(x: number) => number>')
const T10 = Type.Script('ReturnType<(x: number) => number>')
const T11 = Type.Script('InstanceType<(x: number) => number>')

// ------------------------------------------------------------------
// Intrinsic String Manipulation
// ------------------------------------------------------------------
const T12 = Type.Script('Uppercase<"hello">')
const T13 = Type.Script('Lowercase<"hello">')
const T14 = Type.Script('Capitalize<"hello">')
const T15 = Type.Script('Uncapitalize<"hello">')

// ------------------------------------------------------------------
// Extension Types
// ------------------------------------------------------------------
const T16 = Type.Script('Evaluate<{ x: number } & { y: number }>')
```

## Type Modules

The Script function also accepts `type` and `interface` declarations. The return value will be an object containing all embedded declarations.

```typescript
const { Expression, ConstDeclaration, BinaryExpression, ConstExpression } = Type.Script(`
  type Expression = 
    | ConstDeclaration
    | BinaryExpression
    | ConstExpression

  interface ConstDeclaration {
    type: 'ConstDeclaration'
    name: string
    value: Expression
  }
  interface BinaryExpression {
    type: 'BinaryExpression'
    left: Expression
    right: Expression
  }
  interface ConstExpression {
    type: 'ConstExpression'
    const: unknown
  }
`)
```

## Unsupported

The following constructs are currently unsupported.

### Template Literal Substring Infer

Script does not support substring inference with `TemplateLiteral` types.

```typescript
type Get<S extends string> = S extends `hello ${infer Name}` ? Name : never
//                                             ^
//                                             Substring infer not supported
```

### Embedded Function with Generic Type Parameter

Script does not support embedded function types with generic type parameters.

```typescript
type Foo = { x: <T>(value: T) => string }
//              ^ 
//              Embedded generic function not supported
```