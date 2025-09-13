# Pointer

The Pointer namespace is an implementation of [RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901) Json Pointer. It provides functions to read and write values using Json Pointers.

## Get

The Get function will return a value at the pointer or undefined.

```typescript
const X = { x: 1 }

const A = Value.Pointer.Get(X, '/x')                // const A = 1

const B = Value.Pointer.Get(X, '/y')                // const B = undefined
```

## Set

The Set will update a value at the given pointer. If the path does not exist it is created.

```typescript
const X = { x: 1 }

Value.Pointer.Set(X, '/x', 100)                     // X' = { x: 100 }

Value.Pointer.Set(X, '/y', 200)                     // X' = { x: 100, y: 200 }
```

## Has

The Has function will returns true if a value exists at the pointer.

```typescript
const X = { x: 1 }

const A = Value.Pointer.Has(X, '/x')                // const A = true

const B = Value.Pointer.Has(X, '/y')                // const B = false
```

## Delete

The Delete function will delete a value at the given path or no action if the path does not exist.

```typescript
const X = { x: 1 }

Value.Pointer.Delete(X, '/x')                          // X' = { }

Value.Pointer.Delete(X, '/y')                          // X' = { } - no-action
```