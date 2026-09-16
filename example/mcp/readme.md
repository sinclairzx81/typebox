# Mcp: ProtocolType

This example shows immediate inference and compilation of the official Mcp Protocol JSON Schema specification without an offline code generation step. The example is for reference purposes only and is used to demonstrate advanced JSON Schema inference cases for very large schematics.

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