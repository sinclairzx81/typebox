# JSON Type Definition

JSON Type Definition (JTD) specification is an alternative schema specification to JSON Schema that provides better support for nominal type systems. TypeBox doesn't provide JTD support by default, but can be expressed through unsafe types and validated with Ajv.

This example provides a reference implementation for JSON Type Definition.

## TypeDef

Refer to the `typedef.ts` file in this directory for a reference implementation of the JSON Type Definition type builder.

```typescript
import { Static } from '@sinclair/typebox'
import { TypeDef } from './typedef'
```

## Properties

```typescript
// ------------------------------------------------------------------------
// PropertiesType
//
// https://jsontypedef.com/docs/jtd-in-5-minutes/#properties-schemas
//
// ------------------------------------------------------------------------

export type PropertiesType = Static<typeof PropertiesType>
export const PropertiesType = TypeDef.Properties({
  x: TypeDef.Float32(),
  y: TypeDef.Float32(),
  z: TypeDef.Float32(),
})
```

## Values

```typescript
// ------------------------------------------------------------------------
// ValuesType
//
// https://jsontypedef.com/docs/jtd-in-5-minutes/#values-schemas
//
// ------------------------------------------------------------------------

export type ValuesType = Static<typeof ValuesType>
export const ValuesType = TypeDef.Values(TypeDef.Float64())
```

## Enum

```typescript
// ------------------------------------------------------------------------
// EnumType
//
// https://jsontypedef.com/docs/jtd-in-5-minutes/#enum-schemas
//
// ------------------------------------------------------------------------

export type EnumType = Static<typeof EnumType>
export const EnumType = TypeDef.Enum(['FOO', 'BAR', 'BAZ'])
```

## Elements

```typescript
// ------------------------------------------------------------------------
// ElementsType
//
// https://jsontypedef.com/docs/jtd-in-5-minutes/#elements-schemas
//
// ------------------------------------------------------------------------

export type ElementsType = Static<typeof ElementsType>
export const ElementsType = TypeDef.Elements(PropertiesType)
```

## Union

```typescript
// ------------------------------------------------------------------------
// UnionType
//
// https://jsontypedef.com/docs/jtd-in-5-minutes/#discriminator-schemas
//
// ------------------------------------------------------------------------

export type UnionType = Static<typeof UnionType>
export const UnionType = TypeDef.Union('eventType', {
  USER_CREATED: TypeDef.Properties({
    id: TypeDef.String(),
  }),
  USER_PAYMENT_PLAN_CHANGED: TypeDef.Properties({
    id: TypeDef.String(),
    plan: TypeDef.Enum(['FREE', 'PAID']),
  }),
  USER_DELETED: TypeDef.Properties({
    id: TypeDef.String(),
    softDelete: TypeDef.Boolean(),
  }),
})
```
