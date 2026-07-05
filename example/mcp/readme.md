# Mcp: ProtocolType

This example demonstrates how to compile and infer the Mcp Protocol specification directly from JSON Schema. The example uses no code generation, all inference is derived via TypeBox's JSON Schema compiler infrastructure.

## Usage

The following compiles the CallToolRequest protocol definition and parses a value.

```typescript
import { ProtocolValidator, type ProtocolType } from './mcp/index.ts'

// ------------------------------------------------------------------
// Type
// ------------------------------------------------------------------
type CallToolRequest = ProtocolType<'CallToolRequest'>

// ------------------------------------------------------------------
// Validator
// ------------------------------------------------------------------
const CallToolRequestValidator = ProtocolValidator('CallToolRequest')

// ------------------------------------------------------------------
// Parse
// ------------------------------------------------------------------
const callToolRequest = CallToolRequestValidator.Parse({ 
  id: '...',
  jsonrpc: '2.0',
  method: 'tools/call',
  params: {
    _meta: {
      'io.modelcontextprotocol/clientCapabilities': {},
      'io.modelcontextprotocol/clientInfo': { name: '...', version: '...' },
      'io.modelcontextprotocol/protocolVersion': '1',
    },
    name: 'add',
    arguments: {
      x: 1,
      y: 2
    }
  }
})

// ------------------------------------------------------------------
// TypeSafe
// ------------------------------------------------------------------
callToolRequest.id                // 'id'
callToolRequest.jsonrpc           // '2.0'
callToolRequest.method            // 'tools/call'
callToolRequest.params            // { ... }
```