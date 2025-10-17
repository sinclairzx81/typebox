# Setup

TypeBox needs TypeScript to be configured with the following settings.

```typescript
// file: tsconfig.json
{
  "compilerOptions": {
    "strict": true,              // Required for Type Inference
    "target": "ES2018",          // Minimum ES Target
  }
}
```