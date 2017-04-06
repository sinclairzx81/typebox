## typebox

A runtime type system for javascript.

```javascript
const Customer = typebox.Object({
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

typebox is a runtime type system for JavaScript which allows developers to describe complex types and validate 
them against objects at runtime. typebox was primarily written to help validate data for network services, as well 
as to generate rich documentation for network APIs. It was also written to suppliment TypeScript which does not
provide any facility for type checking objects at runtime.

### type system

typebox provides a number of primitive types that can be composed into complex types. typebox attempts to find parity
with the typescript type system, the following table illustrates typescript types and their typebox equivalents.

type         | typescript                                 | typebox
---          | ---                                        | --- 
Any          | ```type T = any```                         | ```const T = typebox.Any()``` |
Null         | ```type T = null```                        | ```const T = typebox.Null()```             |
Undefined    | ```type T = undefined```                   | ```const T = typebox.Undefined()```         |
Object       | ```type T = {name: string}```              | ```const T = typebox.Object({name: typebox.String()})```    |
Array        | ```type T = Array<number>```               | ```const T = typebox.Array(typebox.String())``` |
Tuple        | ```type T = [string, number]```            | ```const T = typebox.Tuple(typebox.String(), typebox.Number())``` |
Number       | ```type T = number```                      | ```const T = typebox.Number()``` |
String       | ```type T = string```                      | ```const T = typebox.String()``` |
Boolean      | ```type T = boolean```                     | ```const T = typebox.Boolean()``` |
Date         | ```type T = Date```                        | ```const T = typebox.Date()``` | 
Function     | ```type T = Function```                    | ```const T = typebox.Function()``` |
Union        | ```type T = string | number```             | ```const T = typebox.Union(typebox.String(), typebox.Number())``` |
Literal      | ```type T = "click"```                     | ```const T = typebox.Literal("click")``` |

### type checking

Once a type is created, an object can be type checked against it by calling the ```typebox.check(...)``` method.

```javascript
const Ship = typebox.Object({
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
const Ship = typebox.Object({
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

let result = typebox.check(Ship, {foo: 123})
if(!result.success) {
  console.log(result.errors)
}
```
which produces the following.
```
[ { message: 'value.foo unexpected.',
    expect: 'undefined',
    actual: 'number' },
  { message: 'value.pilot not found.',
    expect: 'string',
    actual: 'undefined' },
  { message: 'value.position not found.',
    expect: 'tuple',
    actual: 'undefined' },
  { message: 'value.color not found.',
    expect: 'union',
    actual: 'undefined' } ]
```
