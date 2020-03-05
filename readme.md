<div align='center'>

<h1>TypeBox</h1>

<p>JSONSchema Type Builder with Static Type Resolution for TypeScript</p>

[![npm version](https://badge.fury.io/js/%40sinclair%2Ftypebox.svg)](https://badge.fury.io/js/%40sinclair%2Ftypebox)
[![Build Status](https://travis-ci.org/sinclairzx81/typebox.svg?branch=master)](https://travis-ci.org/sinclairzx81/TypeBox)

<img src='./doc/example.gif'></img>


</div>

<a name="Install"></a>

## Install

```
npm install @sinclair/typebox --save
```

<a name="Overview"></a>

## Overview

TypeBox is a type builder library that allows developers to compose complex in-memory JSONSchema objects that can be resolved to static TypeScript types. TypeBox internally represents its types as plain JSONSchema objects and leverages TypeScript's [Mapped Types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) to infer schemas to equivalent static type representations. No additional build process is required.

TypeBox can be used as a tool to build and validate complex schemas, or integrated into RPC or REST services to help validate data received over the wire or published directly to consumers to service as developer documentation.

Note that TypeBox does not provide any mechanisms for validating JSONSchema. Please refer to libraries such as [AJV](https://www.npmjs.com/package/ajv) or similar to validate the schemas created with this library.

Requires TypeScript 3.8.3 and above.

License MIT

## Contents
- [Install](#Install)
- [Overview](#Overview)
- [Example](#Example)
- [Types](#Types)
- [Other Types](#Intrinsics)
- [Functions](#Functions)
- [Validation](#Validation)

## Example

The following shows the type alias for `Order` and its TypeBox equivalent.

```typescript
import { Type, Static } from '@sinclair/typebox'

// Some type...

type Order = {
    email:    string,
    address:  string,
    quantity: number,
    option:   'pizza' | 'salad' | 'pie'
}

// ...can be expressed as...

const Order = Type.Object({
    email:    Type.Format('email'), 
    address:  Type.String(),
    quantity: Type.Range(1, 99),
    option:   Type.Union(
        Type.Literal('pizza'), 
        Type.Literal('salad'),
        Type.Literal('pie')
    )
})

// ... which can be reflected

console.log(JSON.stringify(Order, null, 2))

// ... and statically resolved

type TOrder = Static<typeof Order>

// .. and validated as JSONSchema

JSON.validate(Order, {  // IETF | TC39 ?
    email: 'dave@domain.com', 
    address: '...', 
    quantity: 99, 
    option: 'pie' 
}) 

// ... and so on ...
```

<a href='Types'></a>

## Types

TypeBox functions generate JSONschema objects. The following table outlines the TypeScript and JSONSchema equivalence.

### TypeBox > TypeScript

The following types and modifiers are compatible with JSONschema and have both JSONschema and TypeScript representations.

<table>
    <thead>
        <tr>
            <th>Type</th>
            <th>TypeBox</th>
            <th>TypeScript</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Optional</td>
            <td><code>const T = Type.Object({ email: Type.Optional(Type.String()) })</code></td>
            <td><code>type T = { email?: string }</code></td>
        </tr>       
        <tr>
            <td>Readonly</td>
            <td><code>const T = Type.Object({ email: Type.Readonly(Type.String()) })</code></td>
            <td><code>type T = { readonly email: string }</code></td>
        </tr>
        <tr>
            <td>Literal</td>
            <td><code>const T = Type.Literal(123)</code></td>
            <td><code>type T = 123</code></td>
        </tr>
        <tr>
            <td>String</td>
            <td><code>const T = Type.String()</code></td>
            <td><code>type T = string</code></td>
        </tr>
        <tr>
            <td>Number</td>
            <td><code>const T = Type.Number()</code></td>
            <td><code>type T = number</code></td>
        </tr>
        <tr>
            <td>Boolean</td>
            <td><code>const T = Type.Boolean()</code></td>
            <td><code>type T = boolean</code></td>
        </tr>
        <tr>
            <td>Object</td>
            <td><code>const T = Type.Object({ name: Type.String() })</code></td>
            <td><code>type T = { name: string }</code></td>
        </tr>
        <tr>
            <td>Array</td>
            <td><code>const T = Type.Array(Type.Number())</code></td>
            <td><code>type T = number[]</code></td>
        </tr>
        <tr>
            <td>Map</td>
            <td><code>const T = Type.Map(Type.Number())</code></td>
            <td><code>type T = { [key: string] } : number</code></td>
        </tr>
        <tr>
            <td>Intersect</td>
            <td><code>const T = Type.Intersect(Type.String(), Type.Number())</code></td>
            <td><code>type T = string & number</code></td>
        </tr>
        <tr>
            <td>Union</td>
            <td><code>const T = Type.Union(Type.String(), Type.Number())</code></td>
            <td><code>type T = string | number</code></td>
        </tr>
        <tr>
            <td>Tuple</td>
            <td><code>const T = Type.Tuple(Type.String(), Type.Number())</code></td>
            <td><code>type T = [string, number]</code></td>
        </tr>
        <tr>
            <td>Any</td>
            <td><code>const T = Type.Any()</code></td>
            <td><code>type T = any</code></td>
        </tr>
        <tr>
            <td>Null</td>
            <td><code>const T = Type.Null()</code></td>
            <td><code>type T = null</code></td>
        </tr>
        <tr>
            <td>Pattern</td>
            <td><code>const T = Type.Pattern(/foo/)</code></td>
            <td><code>type T = string</code></td>
        </tr>
        <tr>
            <td>Range</td>
            <td><code>const T = Type.Range(20, 30)</code></td>
            <td><code>type T = number</code></td>
        </tr>
        <tr>
            <td>Format</td>
            <td><code>const T = Type.Format('date-time')</code></td>
            <td><code>type T = string</code></td>
        </tr>
        <tr>
            <td>Guid</td>
            <td><code>const T = Type.Guid()</code></td>
            <td><code>type T = string</code></td>
        </tr>
    </tbody>
</table>

### TypeBox > JSONSchema

The following shows the TypeBox to JSONSchema mappings. The following schemas are returned from each function.

<table>
    <thead>
        <tr>
            <th>Type</th>
            <th>TypeBox</th>
            <th>JSONSchema</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Literal</td>
            <td><code>const T = Type.Literal(123)</code></td>
            <td><code>{ type: 'number', enum: [123] }</code></td>
        </tr>       
        <tr>
            <td>String</td>
            <td><code>const T = Type.String()</code></td>
            <td><code>{ type: 'string' }</code></td>
        </tr>
        <tr>
            <td>Number</td>
            <td><code>const T = Type.Number()</code></td>
            <td><code>{ type: 'number' }</code></td>
        </tr>
        <tr>
            <td>Boolean</td>
            <td><code>const T = Type.Boolean()</code></td>
            <td><code>{ type: 'boolean' }</code></td>
        </tr>
        <tr>
            <td>Object</td>
            <td><code>const T = Type.Object({ name: Type: String() })</code></td>
            <td><code>{ type: 'object': properties: { name: { type: 'string' } }, required: ['name'] }</code></td>
        </tr>
        <tr>
            <td>Array</td>
            <td><code>const T = Type.Array(Type.String())</code></td>
            <td><code>{ type: 'array': items: { type: 'string' } }</code></td>
        </tr>
        <tr>
            <td>Map</td>
            <td><code>const T = Type.Map(Type.Number())</code></td>
            <td><code>{ type: 'object', additionalProperties: { type: 'number' } }</code></td>
        </tr>
        <tr>
            <td>Intersect</td>
            <td><code>const T = Type.Intersect(Type.Number(), Type.String())</code></td>
            <td><code>{ allOf: [{ type: 'number'}, {type: 'string'}] }</code></td>
        </tr>
        <tr>
            <td>Union</td>
            <td><code>const T = Type.Union(Type.Number(), Type.String())</code></td>
            <td><code>{ oneOf: [{ type: 'number'}, {type: 'string'}] }</code></td>
        </tr>
        <tr>
            <td>Tuple</td>
            <td><code>const T = Type.Union(Type.Number(), Type.String())</code></td>
            <td><code>{ type: "array", items: [{type: 'string'}, {type: 'number'}], additionalItems: false, minItems: 2, maxItems: 2 }</code></td>
        </tr>
        <tr>
            <td>Any</td>
            <td><code>const T = Type.Any()</code></td>
            <td><code>{ }</code></td>
        </tr>
        <tr>
            <td>Null</td>
            <td><code>const T = Type.Null()</code></td>
            <td><code>{ type: 'null' }</code></td>
        </tr>
        <tr>
            <td>Pattern</td>
            <td><code>const T = Type.Pattern(/foo/)</code></td>
            <td><code>{ type: 'string', pattern: 'foo' }</code></td>
        </tr>
        <tr>
            <td>Range</td>
            <td><code>const T = Type.Range(20, 30)</code></td>
            <td><code>{ type: 'number', minimum: 20, maximum: 30 }</code></td>
        </tr>
        <tr>
            <td>Format</td>
            <td><code>const T = Type.Format('date-time')</code></td>
            <td><code>{ type: 'string',format: 'date-time' }</code></td>
        </tr>
        <tr>
            <td>Guid</td>
            <td><code>const T = Type.Guid()</code></td>
            <td><code>{ type: 'string', format: '<guid-regex>' }</code></td>
        </tr>
    </tbody>
</table>


<a name="Intrinsics"></a>

## Other Types

TypeBox provides some non-standard JSONSchema functions that TypeBox refers to as Intrinsic types. While these types cannot be used with JSONSchema, they do provide similar reflection and introspection metadata for expressing function signatures with TypeBox.

 See [Functions](#Functions) section for more details.

### TypeBox > Intrinsics

<table>
    <thead>
        <tr>
            <th>Intrinsic</th>
            <th>TypeBox</th>
            <th>TypeScript</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Function</td>
            <td><code>const T = Type.Function([Type.String()], Type.String())</code></td>
            <td><code>type T = (arg0: string) => string</code></td>
        </tr>       
        <tr>
            <td>Promise</td>
            <td><code>const T = Type.Promise(Type.String())</code></td>
            <td><code>type T = Promise&lt;string&gt;</code></td>
        </tr>
        <tr>
            <td>Undefined</td>
            <td><code>const T = Type.Undefined()</code></td>
            <td><code>type T = undefined</code></td>
        </tr>
        <tr>
            <td>Void</td>
            <td><code>const T = Type.Void()</code></td>
            <td><code>type T = void</code></td>
        </tr>
    </tbody>
</table>

### TypeBox > Non Schema

<table>
    <thead>
        <tr>
            <th>Intrinsic</th>
            <th>TypeBox</th>
            <th>TypeScript</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Function</td>
            <td><code>const T = Type.Function([Type.String()], Type.Number())</code></td>
            <td><code>{ type: 'function', arguments: [ { type: 'string' } ], returns: { type: 'number' } }</code></td>
        </tr>       
        <tr>
            <td>Promise</td>
            <td><code>const T = Type.Promise(Type.String())</code></td>
            <td><code>{ type: 'promise', item: { type: 'string' } }</code></td>
        </tr>
        <tr>
            <td>Undefined</td>
            <td><code>const T = Type.Undefined()</code></td>
            <td><code>{ type: 'undefined' }</code></td>
        </tr>
        <tr>
            <td>Void</td>
            <td><code>const T = Type.Void()</code></td>
            <td><code>{ type: 'void' }</code></td>
        </tr>
    </tbody>
</table>

<a href='Functions'></a>

## Functions

TypeBox provides some capabilities for building typed function signatures. It is important to note however that unlike the other functions available on `Type` the `Type.Function(...)` and other intrinsic types do not produce valid JSONSchema. However, the types returned from `Type.Function(...)` may be comprised of schemas that describe its `arguments` and `return` types. Consider the following TypeScript and TypeBox variants.

```typescript

// TypeScript

type T0 = (a0: number, a0: number) => number;

type T1 = (a0: string, a1: () => string) => void;

type T2 = (a0: string) => Promise<number>;

type T3 = () => () => string;

// Convention

Type.Function([...Arguments], ReturnType)

// TypeBox

const T0 = Type.Function([Type.Number(), Type.Number()], Type.Number())

const T1 = Type.Function([Type.String(), Type.Function([], Type.String())], Type.Void())

const T2 = Type.Function([Type.String()], Type.Promise(Type.Number()))

const T3 = Type.Function([], Type.Function([], Type.String()))
```

<a href='Validation'></a>

## Validation

TypeBox does not provide any mechanism for validating JSONSchema out of the box. Users are expected to bring their own JSONSchema validation library. The following demonstrates how you might enable validation with the AJV npm module.

### General

```typescript
import * Ajv from 'ajv'

const ajv = new Ajv({ })

ajv.validate(Type.String(), 'hello')  // true

ajv.validate(Type.String(), 123)      // false
```

### Runtime Type Validation

The following demonstrates how you might want to approach runtime type validation with TypeBox. The following
code creates a function that takes a signature type `S` which is used to infer function arguments. The body
of the function validates with the signatures `arguments` and `returns` schemas against values passed by the
caller.

```typescript
import { Type, Static, TFunction } from '@sinclair/typebox'

// Some validation function.
declare function validate(schema: any, data: any): boolean;

// A function that returns a closure that validates its 
// arguments and return value from the given signature.
function Func<S extends TFunction>(signature: S, func: Static<S>): Static<S> {    
    const validator = (...params: any[]) => {
        params.forEach((param, index) => {
            if(!validate(signature.arguments[index], param)) {
                console.log('error on argument', index)
            }
        })
        const result = (func as Function)(...params);
        if(!validate(signature.return, result)) {
            console.log('error on return')
        }
        return result
    }
    return validator as Static<S>
}

// Create some function.
const Add = Func(
    Type.Function([
        Type.Number(), 
        Type.Number()
    ], Type.Number()), 
    (a, b) => {
        return a + b
    })

// Call it
Add(20, 30)

```