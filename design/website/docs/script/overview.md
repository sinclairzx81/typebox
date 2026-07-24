# Script

TypeScript Syntax Engine For JSON Schema

## Overview

TypeBox includes a runtime TypeScript engine that can transform TypeScript definitions to JSON Schema. The engine is fully type-safe and supports many programmable constructs including Conditional, Mapped, Indexed, Generics, Distributive Generics, and more.

### Example

Syntax highlighting is available via the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=sinclairzx81.typebox-script)

```typescript
// Module
const { Post } = Type.Script(`
  type User = {
    id: number,
    name: string
  }
  type Comment = {
    id: number,
    text: string,
    author: User
  }
  type Post = {
    id: number,
    title: string,
    body: string,
    author: User,
    comments: Comment[]
  }
`)

// Reflection
Post.properties.id
Post.properties.title
Post.properties.author.properties.id
Post.properties.author.properties.name
Post.properties.comments.items.properties.text
Post.properties.comments.items.properties.author.properties.id
Post.properties.comments.items.properties.author.properties.name

// Inference
function present(post: Type.Static<typeof Post>) {
  post.id
  post.title
  post.author.id
  post.author.name
  post.comments[0].text
  post.comments[0].author.id
  post.comments[0].author.name
}
```