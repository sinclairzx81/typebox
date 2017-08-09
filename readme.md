## typebox

A runtime type system for javascript.

```javascript
const Customer = typebox.Complex({
  firstname: typebox.String(),
  lastname : typebox.String(),
  email    : typebox.String(),
  age      : typebox.Number()
})

let result = typebox.check(Customer, {
  firstname : "dave", 
  lastname  : "smith",
  email     : "dave@domain.com",
  age       : 37
})

console.assert(result.success)
```

### overview

typebox is a runtime type system for JavaScript which allows developers to describe complex types and validate them against objects at runtime. typebox was primarily written to help validate data for network services, as well as to generate rich documentation for network APIs. It was also written to suppliment TypeScript which does not provide any facility for type checking objects at runtime.

### type system

typebox provides a number of primitive types that can be composed into complex types. typebox attempts to find parity
with the typescript type system, the following table illustrates typescript types and their typebox equivalents.

type         | typescript                                 | typebox
---          | ---                                        | --- 
Any          | ```type T = any```                         | ```const T = typebox.Any()```               |
Null         | ```type T = null```                        | ```const T = typebox.Null()```              |
Undefined    | ```type T = undefined```                   | ```const T = typebox.Undefined()```         |
Complex      | ```type T = {name: string}```              | ```const T = typebox.Complex({name: typebox.String()})```    |
Array        | ```type T = number[]```                    | ```const T = typebox.Array(typebox.String())``` |
Tuple        | ```type T = [string, number]```            | ```const T = typebox.Tuple(typebox.String(), typebox.Number())``` |
Number       | ```type T = number```                      | ```const T = typebox.Number()```  |
String       | ```type T = string```                      | ```const T = typebox.String()```  |
Boolean      | ```type T = boolean```                     | ```const T = typebox.Boolean()``` |
Union        | ```type T = string or number```            | ```const T = typebox.Union(typebox.String(), typebox.Number())``` |
Literal      | ```type T = "click"```                     | ```const T = typebox.Literal("click")``` |

### runtime type checking

Once a type is created, an object can be type checked against it by calling the ```typebox.check(...)``` method.

```javascript
const Ship = typebox.Complex({
  pilot : typebox.String(),
  position : typebox.Tuple(
    typebox.Number(), 
    typebox.Number()
  ),
  color : typebox.Union (
    typebox.Literal("red"), 
    typebox.Literal("blue"),
    typebox.Literal("green")
  )
})
let result = typebox.check(Ship, {
  pilot    : "dave",  
  position : [0, 0],   
  color    : "red"
})
```
The ```typebox.check(...)``` function returns a type check result object. Callers can inspect this result with.

```javascript
const Ship = typebox.Complex({
  pilot : typebox.String(),
  position : typebox.Tuple(
    typebox.Number(), 
    typebox.Number()
  ),
  color : typebox.Union (
    typebox.Literal("red"), 
    typebox.Literal("blue"),
    typebox.Literal("green")
  )
})

let result = typebox.check(Ship, {
  foo     : 123, 
  position: [1],
  color   : "orange" 
})

if(!result.success) {
  console.log(JSON.stringify(result.errors, null, 2))
}
```
which outputs the following...
```json
[
  {
    "binding": "value.foo",
    "message": "Property of type 'number' is not valid for this object",
    "expect": "undefined",
    "actual": "number"
  },
  {
    "binding": "value.pilot",
    "message": "Property of type 'string' is required",
    "expect": "string",
    "actual": "undefined"
  },
  {
    "binding": "value.position",
    "message": "Property of type 'array' with a length 1 is invalid. Expect length of 2",
    "expect": "tuple",
    "actual": "array"
  },
  {
    "binding": "value.color",
    "message": "Type 'string' is not assignable to type 'red | blue | green'",
    "expect": "red | blue | green",
    "actual": "string"
  }
]
```

### static type resolution for typescript

It is possible to map a typebox type back to a static TypeScript type using TypeScript Mapped types feature. 

note: static type resolution has been tested with TypeScript version 2.2.2 and integrates will with modern typescript tooling in vscode.

```typescript
// typebox type.
const User = typebox.Complex({
  name  : typebox.String(),
  email : typebox.String(),
  roles : typebox.Array(typebox.String()),
})

// resolve static type for method.
const method = (user: typebox.Static<typeof User>) => {
  user.name = "dave"
  user.email = "dave@domain.com"
  user.roles = ["administrator"]
}
```

### generating json schema

typebox provides functionality to generate draft-4 compatiable JSONschema from typebox types allowing type information
to be shared to JSONSchema compatible user.

```javascript
const Ship = typebox.Complex({
  pilot : typebox.String(),
  position : typebox.Tuple(
    typebox.Number(), 
    typebox.Number()
  ),
  color : typebox.Union (
    typebox.Literal("red"), 
    typebox.Literal("blue"),
    typebox.Literal("green")
  )
})

let schema = typebox.check(Ship)

console.log(JSON.stringify(schema, null, 2))
```
which outputs the following.
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "pilot": {
      "type": "string"
    },
    "position": {
      "type": "array",
      "items": [
        {
          "type": "number"
        },
        {
          "type": "number"
        }
      ],
      "additionalItems": false,
      "minItems": 2,
      "maxItems": 2
    },
    "color": {
      "anyOf": [
        {
          "type": "string",
          "pattern": "red"
        },
        {
          "type": "string",
          "pattern": "blue"
        },
        {
          "type": "string",
          "pattern": "green"
        }
      ]
    }
  },
  "required": [
    "pilot",
    "position",
    "color"
  ]
}
```

### license

MIT