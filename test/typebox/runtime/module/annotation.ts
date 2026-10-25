import * as Module from 'typebox/module'
import Type from 'typebox'
import { Assert } from 'test'

const Test = Assert.Context('Module.Annotation')

// ------------------------------------------------------------------
// Keyword
// ------------------------------------------------------------------
Test('Should Keyword 1', () => {
  const A = Type.Any()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'any')
})
Test('Should Keyword 2', () => {
  const A = Type.BigInt()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'bigint')
})
Test('Should Keyword 3', () => {
  const A = Type.Boolean()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'boolean')
})
Test('Should Keyword 4', () => {
  const A = Type.Integer()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'number')
})
Test('Should Keyword 5', () => {
  const A = Type.Never()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'never')
})
Test('Should Keyword 6', () => {
  const A = Type.Null()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'null')
})
Test('Should Keyword 7', () => {
  const A = Type.Number()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'number')
})
Test('Should Keyword 8', () => {
  const A = Type.String()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'string')
})
Test('Should Keyword 9', () => {
  const A = Type.Symbol()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'symbol')
})
Test('Should Keyword 10', () => {
  const A = Type.Undefined()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'undefined')
})
Test('Should Keyword 11', () => {
  const A = Type.Unknown()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'unknown')
})
Test('Should Keyword 12', () => {
  const A = Type.Void()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'void')
})
// ------------------------------------------------------------------
// Literal
// ------------------------------------------------------------------
Test('Should Literal 1', () => {
  const A = Type.Literal('hello')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '"hello"')
})
Test('Should Literal 2', () => {
  const A = Type.Literal(1)
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '1')
})
Test('Should Literal 3', () => {
  const A = Type.Literal(true)
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'true')
})
Test('Should Literal 4', () => {
  const A = Type.Literal('a"b')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '"a\\"b"')
})
// ------------------------------------------------------------------
// Enum
// ------------------------------------------------------------------
Test('Should Enum 1', () => {
  const A = Type.Enum(['A', 'B'])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '("A" | "B")')
})
Test('Should Enum 2', () => {
  const A = Type.Enum([1, 2])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '(1 | 2)')
})
// ------------------------------------------------------------------
// Array
// ------------------------------------------------------------------
Test('Should Array 1', () => {
  const A = Type.Array(Type.Any())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'any[]')
})
Test('Should Array 2', () => {
  const A = Type.Array(Type.String())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'string[]')
})
Test('Should Array 3', () => {
  const A = Type.Array(Type.Array(Type.Number()))
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'number[][]')
})
Test('Should Array 4', () => {
  const A = Type.Array(Type.Union([Type.String(), Type.Number()]))
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '(string | number)[]')
})
Test('Should Array 5', () => {
  const A = Type.ReadonlyObject(Type.Array(Type.Any()))
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'readonly any[]')
})
// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
Test('Should Tuple 1', () => {
  const A = Type.Tuple([Type.String(), Type.Number()])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '[string, number]')
})
Test('Should Tuple 2', () => {
  const A = Type.Tuple([])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '[]')
})
Test('Should Tuple 3', () => {
  const A = Type.ReadonlyObject(Type.Tuple([Type.String(), Type.Number()]))
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'readonly [string, number]')
})
// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
Test('Should Union 1', () => {
  const A = Type.Union([Type.String(), Type.Number()])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '(string | number)')
})
Test('Should Union 2', () => {
  const A = Type.Union([])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'never')
})
Test('Should Union 3', () => {
  const A = Type.Union([Type.String()])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '(string)')
})
Test('Should Union 4', () => {
  const A = Type.Union([Type.String(), Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '(string | ({ x: number } & { y: number }))')
})
// ------------------------------------------------------------------
// Intersect
// ------------------------------------------------------------------
Test('Should Intersect 1', () => {
  const A = Type.Intersect([Type.Object({ x: Type.Number() }), Type.Object({ y: Type.Number() })])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '({ x: number } & { y: number })')
})
Test('Should Intersect 2', () => {
  const A = Type.Intersect([Type.String()])
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '(string)')
})
// ------------------------------------------------------------------
// Object
// ------------------------------------------------------------------
Test('Should Object 1', () => {
  const A = Type.Object({})
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{}')
})
Test('Should Object 2', () => {
  const A = Type.Object({ x: Type.Number(), y: Type.String() })
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ x: number, y: string }')
})
Test('Should Object 3', () => {
  const A = Type.Object({ x: Type.Optional(Type.Number()) })
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ x?: number }')
})
Test('Should Object 4', () => {
  const A = Type.Object({ x: Type.Readonly(Type.Number()) })
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ readonly x: number }')
})
Test('Should Object 5', () => {
  const A = Type.Object({ x: Type.Readonly(Type.Optional(Type.Number())) })
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ readonly x?: number }')
})
Test('Should Object 6', () => {
  const A = Type.Object({ 'a-b': Type.Number() })
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ "a-b": number }')
})
Test('Should Object 7', () => {
  const A = Type.Object({ 'a"b': Type.Number() })
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ "a\\"b": number }')
})
Test('Should Object 8', () => {
  const A = Type.Object({ a: Type.Object({ b: Type.Number() }) })
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ a: { b: number } }')
})
// ------------------------------------------------------------------
// Record
// ------------------------------------------------------------------
Test('Should Record 1', () => {
  const A = Type.Record(Type.String(), Type.Number())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'Record<string, number>')
})
Test('Should Record 2', () => {
  const A = Type.Record(Type.Number(), Type.String())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'Record<number, string>')
})
// ------------------------------------------------------------------
// Constructor
// ------------------------------------------------------------------
Test('Should Constructor 1', () => {
  const A = Type.Constructor([Type.Number()], Type.String())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'new (arg0: number) => string')
})
Test('Should Constructor 2', () => {
  const A = Type.Constructor([], Type.String())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'new () => string')
})
// ------------------------------------------------------------------
// Function
// ------------------------------------------------------------------
Test('Should Function 1', () => {
  const A = Type.Function([Type.Number(), Type.String()], Type.Boolean())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '(arg0: number, arg1: string) => boolean')
})
Test('Should Function 2', () => {
  const A = Type.Function([], Type.Void())
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '() => void')
})
// ------------------------------------------------------------------
// Ref
// ------------------------------------------------------------------
Test('Should Ref 1', () => {
  const A = Type.Ref('A')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'A')
})
// ------------------------------------------------------------------
// This
// ------------------------------------------------------------------
Test('Should This 1', () => {
  const A = Type.This()
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'any')
})
// ------------------------------------------------------------------
// Cyclic
// ------------------------------------------------------------------
Test('Should Cyclic 1', () => {
  const A = Type.Cyclic({ A: Type.Object({ next: Type.Ref('A') }) }, 'A')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '{ next: { next: any } }')
})
// ------------------------------------------------------------------
// TemplateLiteral
// ------------------------------------------------------------------
Test('Should TemplateLiteral 1', () => {
  const A = Type.TemplateLiteral('A${string}')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '`A${string}`')
})
Test('Should TemplateLiteral 2', () => {
  const A = Type.TemplateLiteral('${number}px')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '`${number}px`')
})
Test('Should TemplateLiteral 3', () => {
  const A = Type.TemplateLiteral('A')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '`A`')
})
Test('Should TemplateLiteral 4', () => {
  const A = Type.TemplateLiteral('${"A" | "B"}')
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, '`${("A" | "B")}`')
})
// ------------------------------------------------------------------
// Fallback
// ------------------------------------------------------------------
Test('Should Fallback 1', () => {
  const A = Type.Unsafe({})
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'unknown')
})
Test('Should Fallback 2', () => {
  const A = {} as any
  const B = Module.Annotation.Infer(A)
  Assert.IsEqual(B, 'unknown')
})
