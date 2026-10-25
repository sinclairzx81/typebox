import * as Module from 'typebox/module'
import { Assert } from 'test'

const Test = Assert.Context('Module.Section')

// ------------------------------------------------------------------
// Evaluate: Value Round Trip
// ------------------------------------------------------------------
function Evaluate(code: string): any {
  return new Function(`return (${code})`)()
}
// ------------------------------------------------------------------
// Section.FormatModule (Additional Format Coverage)
// ------------------------------------------------------------------
Test('Should FormatModule 0', () => {
  const info = Module.BuildInfo.Create(false)
  info.UseFormatJsonPointerUriFragment = true
  const result = Module.Section.FormatModule(info)
  Assert.IsTrue(result.includes('IsJsonPointerUriFragment'))
})
Test('Should FormatModule 1', () => {
  const info = Module.BuildInfo.Create(false)
  info.UseFormatUrl = true
  const result = Module.Section.FormatModule(info)
  Assert.IsTrue(result.includes('IsUrl'))
})
// ------------------------------------------------------------------
// Section.Code
// ------------------------------------------------------------------
Test('Should Code 0', () => {
  const code = 'return Guard.IsString(value) && Format.Test(value) && Hashing.Hash(value)'
  const info = { ...Module.BuildInfo.Create(false), NameOfGuard: 'G1', NameOfFormat: 'F1', NameOfHashing: 'H1' }
  const result = Module.Section.Code(info, code)
  Assert.IsEqual(result, 'return G1.IsString(value) && F1.Test(value) && H1.Hash(value)')
})
Test('Should Code 1', () => {
  const code = 'return Guard.IsString(value) && Format.Test(value) && Hashing.Hash(value)'
  const info = { ...Module.BuildInfo.Create(false), NameOfGuard: 'Guard', NameOfFormat: 'Format', NameOfHashing: 'Hashing' }
  const result = Module.Section.Code(info, code)
  Assert.IsEqual(result, code)
})
// ------------------------------------------------------------------
// Section.Value
// ------------------------------------------------------------------
Test('Should Value 0', () => {
  const result = Module.Section.Value('hello')
  Assert.IsEqual(result, '"hello"')
})
Test('Should Value 1', () => {
  const result = Module.Section.Value(123n)
  Assert.IsEqual(result, 'BigInt("123")')
})
Test('Should Value 2', () => {
  const result = Module.Section.Value(Symbol('hello'))
  Assert.IsEqual(result, 'Symbol("hello")')
})
Test('Should Value 3', () => {
  const result = Module.Section.Value(Symbol())
  Assert.IsEqual(result, 'Symbol(undefined)')
})
Test('Should Value 4', () => {
  const result = Module.Section.Value(function A() {})
  Assert.IsTrue(result.includes('function'))
})
Test('Should Value 5', () => {
  const result = Module.Section.Value(undefined)
  Assert.IsEqual(result, 'undefined')
})
// ------------------------------------------------------------------
// Section.Value: String
// ------------------------------------------------------------------
Test('Should Value 6', () => {
  const result = Module.Section.Value('a"b')
  Assert.IsEqual(result, '"a\\"b"')
})
Test('Should Value 7', () => {
  const result = Module.Section.Value('a\\b')
  Assert.IsEqual(result, '"a\\\\b"')
})
Test('Should Value 8', () => {
  const result = Module.Section.Value('a\nb')
  Assert.IsEqual(result, '"a\\nb"')
})
Test('Should Value 9', () => {
  const result = Module.Section.Value('\r\t') // carriage return + tab
  Assert.IsEqual(result, '"\\r\\t"')
})
Test('Should Value 10', () => {
  const result = Module.Section.Value('\0') // null byte
  Assert.IsEqual(result, '"\\u0000"')
})
Test('Should Value 11', () => {
  const result = Module.Section.Value("a'b")
  Assert.IsEqual(result, `"a'b"`)
})
Test('Should Value 12', () => {
  const input = '`${x}`' // template literal syntax must stay inert
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, `"${input}"`)
  Assert.IsEqual(Evaluate(result), input)
})
Test('Should Value 13', () => {
  // JSON.stringify leaves U+2028/2029 unescaped; valid in string literals since ES2019
  const input = 'a\u2028b\u2029c'
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, `"${input}"`)
  Assert.IsEqual(Evaluate(result), input)
})
Test('Should Value 14', () => {
  const result = Module.Section.Value('\ud800') // lone surrogate is escaped
  Assert.IsEqual(result, '"\\ud800"')
})
Test('Should Value 15', () => {
  const result = Module.Section.Value('😀') // valid surrogate pair is preserved
  Assert.IsEqual(result, '"😀"')
})
Test('Should Value 16', () => {
  const input = '"; throw new Error("injected"); "' // string breakout attempt
  const result = Module.Section.Value(input)
  Assert.IsEqual(Evaluate(result), input)
})
// ------------------------------------------------------------------
// Section.Value: Keys
// ------------------------------------------------------------------
Test('Should Value 17', () => {
  const result = Module.Section.Value({ 'a"b': 1 })
  Assert.IsEqual(result, '{ "a\\"b": 1 }')
})
Test('Should Value 18', () => {
  const result = Module.Section.Value({ 'a\nb': 1 })
  Assert.IsEqual(result, '{ "a\\nb": 1 }')
})
Test('Should Value 19', () => {
  // JSON.parse creates an own '__proto__' property (an object literal would set the prototype)
  const input = JSON.parse('{"__proto__": 1}')
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, '{ ["__proto__"]: 1 }')
  const output = Evaluate(result)
  Assert.IsEqual(Object.getPrototypeOf(output), Object.prototype)
  Assert.IsTrue(Object.prototype.hasOwnProperty.call(output, '__proto__'))
})
Test('Should Value 20', () => {
  // prototype pollution attempt must remain an own property, not change the prototype
  const input = JSON.parse('{"__proto__": {"polluted": true}}')
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, '{ ["__proto__"]: { polluted: true } }')
  const output = Evaluate(result)
  Assert.IsEqual(output.polluted, undefined)
  Assert.IsEqual(Object.getPrototypeOf(output), Object.prototype)
})
Test('Should Value 21', () => {
  const result = Module.Section.Value({ 'a b': 1 })
  Assert.IsEqual(result, '{ "a b": 1 }')
})
Test('Should Value 22', () => {
  const result = Module.Section.Value({ '0': 1 }) // leading digit is not an identifier
  Assert.IsEqual(result, '{ "0": 1 }')
})
Test('Should Value 23', () => {
  const result = Module.Section.Value({ '': 1 }) // empty key
  Assert.IsEqual(result, '{ "": 1 }')
})
Test('Should Value 24', () => {
  const result = Module.Section.Value({ class: 1 }) // reserved words are valid property names
  Assert.IsEqual(result, '{ class: 1 }')
})
Test('Should Value 25', () => {
  const input = { 'a: 1, b': 2 } // key breakout attempt
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, '{ "a: 1, b": 2 }')
  Assert.IsEqual(Object.keys(Evaluate(result)), ['a: 1, b'])
})
Test('Should Value 26', () => {
  const result = Module.Section.Value({ é: 1 })
  Assert.IsEqual(result, '{ "é": 1 }')
})
// ------------------------------------------------------------------
// Section.Value: Symbol
// ------------------------------------------------------------------
Test('Should Value 27', () => {
  const result = Module.Section.Value(Symbol('a"b'))
  Assert.IsEqual(result, 'Symbol("a\\"b")')
})
Test('Should Value 28', () => {
  const result = Module.Section.Value(Symbol.for('hello'))
  Assert.IsEqual(result, 'Symbol.for("hello")')
})
Test('Should Value 29', () => {
  const input = Symbol.for('a"b\n')
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, 'Symbol.for("a\\"b\\n")')
  Assert.IsTrue(Evaluate(result) === input) // registered symbols round-trip to the same symbol
})
Test('Should Value 30', () => {
  const result = Module.Section.Value(Symbol('')) // empty string, not undefined
  Assert.IsEqual(result, 'Symbol("")')
})
// ------------------------------------------------------------------
// Section.Value: BigInt
// ------------------------------------------------------------------
Test('Should Value 31', () => {
  const result = Module.Section.Value(-123n)
  Assert.IsEqual(result, 'BigInt("-123")')
})
// ------------------------------------------------------------------
// Section.Value: RegExp
// ------------------------------------------------------------------
Test('Should Value 32', () => {
  const input = /a\/b/gi
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, '/a\\/b/gi')
  const output = Evaluate(result)
  Assert.IsEqual(output.source, input.source)
  Assert.IsEqual(output.flags, input.flags)
})
Test('Should Value 33', () => {
  const input = new RegExp('/')
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, '/\\//')
  Assert.IsEqual(Evaluate(result).source, input.source)
})
Test('Should Value 34', () => {
  const input = new RegExp('\n')
  const result = Module.Section.Value(input)
  Assert.IsEqual(result, '/\\n/')
  Assert.IsTrue(Evaluate(result).test('\n'))
})
// ------------------------------------------------------------------
// Section.Value: Nested Escapes
// ------------------------------------------------------------------
Test('Should Value 35', () => {
  const result = Module.Section.Value(['a"b', 'c\nd'])
  Assert.IsEqual(result, '["a\\"b", "c\\nd"]')
})
Test('Should Value 36', () => {
  const result = Module.Section.Value({ a: ['x"y'], 'b"c': { d: '\n' } })
  Assert.IsEqual(result, '{ a: ["x\\"y"], "b\\"c": { d: "\\n" } }')
})
// ------------------------------------------------------------------
// Section.Identifier
// ------------------------------------------------------------------
Test('Should Identifier 0', () => {
  const info = Module.BuildInfo.Create()
  const result = Module.Section.Identifier(info, 'A')
  Assert.IsEqual(result, 'A')
})
Test('Should Identifier 1', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'switch'))
})
Test('Should Identifier 2', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, '0'))
})
Test('Should Identifier 3', () => {
  const info = Module.BuildInfo.Create()
  Assert.IsEqual(Module.Section.Identifier(info, '_A'), '_A')
})
Test('Should Identifier 4', () => {
  const info = Module.BuildInfo.Create()
  Assert.IsEqual(Module.Section.Identifier(info, '$A'), '$A')
})
Test('Should Identifier 5', () => {
  const info = Module.BuildInfo.Create()
  Assert.IsEqual(Module.Section.Identifier(info, 'A1_$b'), 'A1_$b')
})
Test('Should Identifier 6', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, ''))
})
Test('Should Identifier 7', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A B'))
})
Test('Should Identifier 8', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A-B'))
})
Test('Should Identifier 9', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A.B'))
})
Test('Should Identifier 10', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A"B'))
})
Test('Should Identifier 11', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, "A'B"))
})
Test('Should Identifier 12', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A`B'))
})
Test('Should Identifier 13', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A\\B'))
})
Test('Should Identifier 14', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A\nB'))
})
Test('Should Identifier 15', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A\n'))
})
Test('Should Identifier 16', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A\0'))
})
Test('Should Identifier 17', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A\u2028B'))
})
Test('Should Identifier 18', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A;B'))
})
Test('Should Identifier 19', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'A(){}; throw 1; //')) // code injection
})
Test('Should Identifier 20', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, '\\u0041')) // unicode escape sequence as text
})
Test('Should Identifier 21', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, '1A'))
})
Test('Should Identifier 22', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'class'))
})
Test('Should Identifier 23', () => {
  const info = Module.BuildInfo.Create()
  Assert.Throws(() => Module.Section.Identifier(info, 'null'))
})
Test('Should Identifier 24', () => {
  const info = Module.BuildInfo.Create()
  Assert.IsEqual(Module.Section.Identifier(info, 'Switch'), 'Switch')
})
