## Mcp Protocol Types

This example demonstrates using TypeBox to infer to MCP protocol types directly from the core protocol definitions. The implementation is an advanced usage of TypeBox's Json Schema inference infrastructure and shows that high-fidelity types can be derived directly from schematics without requiring to code generation or explicit TS type duplication.

[Example Reference Link](https://tsplay.dev/WKYeyN)

## Specifications

- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2024-11-05/schema.json
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2025-03-26/schema.json
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2025-06-18/schema.json
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/draft/schema.json

## Implementation

A complete reference implementation is located in `./mcp.ts` that loads and infers from 4 distinct protocol specifications. The each specification is returned with a `X` prefix.

```typescript
import { type Static } from 'typebox'

import _2024_11_05 from './2024-11-05.json' with { type: 'json' }
import _2025_03_26 from './2025-03-26.json' with { type: 'json' }
import _2025_06_18 from './2025-06-18.json' with { type: 'json' }
import _Draft from './draft.json' with { type: 'json' }

type AutoSpec<Defs extends string, Spec extends { [_ in Defs]: Record<string, unknown> }> = {
  [Key in Extract<keyof Spec[Defs], string>]: Static<Spec & { $ref: `#/${Defs}/${Key}` }>
}
type _2024_11_05 = AutoSpec<'definitions', typeof _2024_11_05>
type _2025_03_26 = AutoSpec<'definitions', typeof _2025_03_26>
type _2025_06_18 = AutoSpec<'definitions', typeof _2025_06_18>
type _Draft = AutoSpec<'$defs', typeof _Draft>

export type X2024_11_05 = _2024_11_05
export type X2025_03_26 = _2025_03_26
export type X2025_06_18 = _2025_06_18
export type XDraft = _Draft
```

Example usage below

```typescript
import { type XDraft } from './mcp.ts'

function test(value: XDraft['Annotation']) {
  const { audience, lastModified, priority } = value // type-safe
}

```