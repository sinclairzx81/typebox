import { TypeGuard } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Syntax } from '@sinclair/typebox/syntax'
import { Assert } from '../assert/index'

// prettier-ignore
describe('syntax/Syntax', () => {
  // ----------------------------------------------------------------
  // Type Expressions
  // ----------------------------------------------------------------
  it('Should parse Any', () => {
    const T = Syntax(`any`)
    Assert.IsTrue(TypeGuard.IsAny(T))
  })
  it('Should parse Array 1', () => {
    const T = Syntax(`number[]`)
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  it('Should parse Array 2', () => {
    const T = Syntax(`Array<number>`)
    Assert.IsTrue(TypeGuard.IsArray(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  it('Should parse AsyncIterator', () => {
    const T = Syntax(`AsyncIterator<number>`)
    Assert.IsTrue(TypeGuard.IsAsyncIterator(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  it('Should parse Awaited', () => {
    const T = Syntax(`Awaited<Promise<number>>`)
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should parse BigInt', () => {
    const T = Syntax(`bigint`)
    Assert.IsTrue(TypeGuard.IsBigInt(T))
  })
  it('Should parse Boolean', () => {
    const T = Syntax(`boolean`)
    Assert.IsTrue(TypeGuard.IsBoolean(T))
  })
  it('Should parse ConstructorParameters', () => {
    const T = Syntax(`ConstructorParameters<new (a: number, b: string) => boolean>`)
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  it('Should parse Constructor', () => {
    const T = Syntax(`new (a: number, b: string) => boolean`)
    Assert.IsTrue(TypeGuard.IsConstructor(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.parameters[0]))
    Assert.IsTrue(TypeGuard.IsString(T.parameters[1]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.returns))
  })
  it('Should parse Date', () => {
    const T = Syntax(`Date`)
    Assert.IsTrue(TypeGuard.IsDate(T))
  })
  it('Should parse Exclude', () => {
    const T = Syntax(`Exclude<1 | 2 | 3, 1>`)
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(T.anyOf[0].const === 2)
    Assert.IsTrue(T.anyOf[1].const === 3)
  })
  it('Should parse Extract', () => {
    const T = Syntax(`Extract<1 | 2 | 3, 1 | 2>`)
    Assert.IsTrue(TypeGuard.IsUnion(T))
    // @ts-ignore fix: incorrect union order (result of UnionToTuple, replace with Tuple destructuring)
    Assert.IsTrue(T.anyOf[0].const === 1)
    // @ts-ignore fix: incorrect union order (result of UnionToTuple, replace with Tuple destructuring)
    Assert.IsTrue(T.anyOf[1].const === 2)
  })
  it('Should parse Function', () => {
    const T = Syntax(`(a: number, b: string) => boolean`)
    Assert.IsTrue(TypeGuard.IsFunction(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.parameters[0]))
    Assert.IsTrue(TypeGuard.IsString(T.parameters[1]))
    Assert.IsTrue(TypeGuard.IsBoolean(T.returns))
  })
  it('Should parse Indexed 1', () => {
    const T = Syntax(`{ x: 1, y: 2, z: 3 }['x']`)
    Assert.IsTrue(T.const === 1)
  })
  it('Should parse Indexed 2', () => {
    const T = Syntax(`{ x: 1, y: 2, z: 3 }['x' | 'y' | 'z']`)
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(T.anyOf[0].const === 1)
    Assert.IsTrue(T.anyOf[1].const === 2)
    Assert.IsTrue(T.anyOf[2].const === 3)
  })
  it('Should parse Indexed 3', () => {
    const T = Syntax(`{ x: 1, y: 2, z: 3 }`)
    const S = Syntax({ T }, `T[keyof T]`)
    Assert.IsTrue(TypeGuard.IsUnion(S))
    Assert.IsTrue(S.anyOf[0].const === 1)
    Assert.IsTrue(S.anyOf[1].const === 2)
    Assert.IsTrue(S.anyOf[2].const === 3)
  })
  it('Should parse Indexed 4', () => {
    const T = Syntax(`['A', 'B', 'C']`)
    const S = Syntax({ T }, `T[number]`)
    Assert.IsTrue(TypeGuard.IsUnion(S))
    Assert.IsTrue(S.anyOf[0].const === 'A')
    Assert.IsTrue(S.anyOf[1].const === 'B')
    Assert.IsTrue(S.anyOf[2].const === 'C')
  })
  it('Should parse Integer', () => {
    const T = Syntax(`integer`)
    Assert.IsTrue(TypeGuard.IsInteger(T))
  })
  it('Should parse Intersect 1', () => {
    const T = Syntax(`1 & 2`)
    Assert.IsTrue(TypeGuard.IsIntersect(T))
    Assert.IsTrue(T.allOf[0].const === 1)
    Assert.IsTrue(T.allOf[1].const === 2)
  })
  it('Should parse Intersect 2', () => {
    const T = Syntax(`1 & (2 & 3)`) // expect flatten
    Assert.IsTrue(TypeGuard.IsIntersect(T))
    Assert.IsTrue(T.allOf[0].const === 1)
    Assert.IsTrue(T.allOf[1].const === 2)
    Assert.IsTrue(T.allOf[2].const === 3)
  })
  it('Should parse Intersect 3', () => {
    const T = Syntax(`(1 | 2) & 3`) // operator precedence
    Assert.IsTrue(TypeGuard.IsIntersect(T))
    Assert.IsTrue(TypeGuard.IsUnion(T.allOf[0]))
    Assert.IsTrue(T.allOf[1].const === 3)
  })
  it('Should parse InstanceType 1', () => {
    const T = Syntax(`InstanceType<new () => { x: 1, y: 2 }>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(T.properties.x.const === 1)
    Assert.IsTrue(T.properties.y.const === 2)
  })
  it('Should parse InstanceType 2', () => {
    const T = Syntax(`InstanceType<number>`) // generalization issue
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  it('Should parse Iterator', () => {
    const T = Syntax(`Iterator<number>`)
    Assert.IsTrue(TypeGuard.IsIterator(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items))
  })
  it('Should parse KeyOf 1', () => {
    const T = Syntax(`keyof { x: 1, y: 2 }`)
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(T.anyOf[0].const === 'x')
    Assert.IsTrue(T.anyOf[1].const === 'y')
  })
  it('Should parse KeyOf 2', () => {
    const T = Syntax(`keyof [0, 1]`)
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(T.anyOf[0].const === '0')
    Assert.IsTrue(T.anyOf[1].const === '1')
  })
  it('Should parse KeyOf 3', () => {
    const T = Syntax(`{ x: 1, y: 2 }`)
    const S = Syntax({ T }, `keyof T`)
    Assert.IsTrue(TypeGuard.IsUnion(S))
    Assert.IsTrue(S.anyOf[0].const === 'x')
    Assert.IsTrue(S.anyOf[1].const === 'y')
  })
  it('Should parse Literal Boolean 1', () => {
    const T = Syntax(`true`)
    Assert.IsTrue(T.const === true)
  })
  it('Should parse Literal Boolean 2', () => {
    const T = Syntax(`false`)
    Assert.IsTrue(T.const === false)
  })
  it('Should parse Literal Number', () => {
    const T = Syntax(`1`)
    Assert.IsTrue(T.const === 1)
  })
  it('Should parse Literal String', () => {
    const T = Syntax(`'1'`)
    Assert.IsTrue(T.const === '1')
  })
  it('Should parse Mapped (Pending)', () => {
    const T = Syntax(`{ [K in 1 | 2 | 3]: K }`)
    Assert.IsTrue(T.const === 'Mapped types not supported')
  })
  it('Should parse Never', () => {
    const T = Syntax(`never`)
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  it('Should parse Null', () => {
    const T = Syntax(`null`)
    Assert.IsTrue(TypeGuard.IsNull(T))
  })
  it('Should parse Number', () => {
    const T = Syntax(`number`)
    Assert.IsTrue(TypeGuard.IsNumber(T))
  })
  it('Should parse Object 1', () => {
    const T = Syntax(`{x: boolean, y: number, z: string, }`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsString(T.properties.z))
  })
  it('Should parse Object 2', () => {
    const T = Syntax(`{x: boolean; y: number; z: string; }`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsString(T.properties.z))
  })
  it('Should parse Object 3', () => {
    const T = Syntax(`{
      x: boolean 
      y: number
      z: string
    }`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsString(T.properties.z))
  })
  it('Should parse Object 4', () => {
    const T = Syntax(`{
      x: boolean; 
      y: number; 
      z: string;
    }`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsString(T.properties.z))
  })
  it('Should parse Object 5', () => {
    const T = Syntax(`{
      x: boolean, 
      y: number,
      z: string,
    }`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsString(T.properties.z))
  })
  it('Should parse Omit 1', () => {
    const T = Syntax(`Omit<{ x: boolean, y: number, z: string }, 'z'>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(('z' in T.properties) === false)
  })
  it('Should parse Omit 2', () => {
    const T = Syntax(`Omit<{ x: boolean, y: number, z: string }, 'z' | 'y'>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(('y' in T.properties) === false)
    Assert.IsTrue(('z' in T.properties) === false)
  })
  it('Should parse Parameters', () => {
    const T = Syntax(`Parameters<(a: number, b: string) => boolean>`)
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  it('Should parse Partial', () => {
    const T = Syntax(`Partial<{ x: boolean, y: number, z: string }>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(('required' in T) === false)
  })
  it('Should parse Pick 1', () => {
    const T = Syntax(`Pick<{ x: boolean, y: number, z: string }, 'x' | 'y'>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(('z' in T.properties) === false)
  })
  it('Should parse Pick 2', () => {
    const T = Syntax(`Pick<{ x: boolean, y: number, z: string }, 'x'>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(('y' in T.properties) === false)
    Assert.IsTrue(('z' in T.properties) === false)
  })
  it('Should parse Promise', () => {
    const T = Syntax(`Promise<number>`)
    Assert.IsTrue(TypeGuard.IsPromise(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.item))
  })
  it('Should parse ReadonlyOptional', () => {
    const T = Syntax(`{ readonly x?: boolean, readonly y?: number }`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
    Assert.IsTrue(TypeGuard.IsOptional(T.properties.y))
  })
  it('Should parse Readonly', () => {
    const T = Syntax(`{ readonly x: boolean, readonly y: number }`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsBoolean(T.properties.x))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
    Assert.IsTrue(TypeGuard.IsReadonly(T.properties.y))
  })
  it('Should parse Record 1', () => {
    const T = Syntax(`Record<string, number>`)
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties['^(.*)$']))
  })
  it('Should parse Record 2', () => {
    const T = Syntax(`Record<number, number>`)
    Assert.IsTrue(TypeGuard.IsRecord(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.patternProperties['^(0|[1-9][0-9]*)$']))
  })
  it('Should parse Record 3', () => {
    const T = Syntax(`Record<'x' | 'y', number>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.x))
    Assert.IsTrue(TypeGuard.IsNumber(T.properties.y))
  })
  it('Should parse Recursive', () => {
    const T = Type.Recursive(This => Syntax({ This }, `{ id: string, nodes: This[] }`))
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(TypeGuard.IsString(T.properties.id))
    Assert.IsTrue(TypeGuard.IsArray(T.properties.nodes))
    Assert.IsTrue(TypeGuard.IsThis(T.properties.nodes.items))
  })
  it('Should parse Ref', () => {
    const T = Syntax('foo')
    Assert.IsTrue(TypeGuard.IsRef(T))
    Assert.IsTrue(T.$ref === 'foo')
  })
  it('Should parse Required', () => {
    const T = Syntax(`Required<{ x?: boolean, y?: number, z?: string }>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsEqual(T.required, ['x', 'y', 'z'])
  })
  it('Should parse ReturnType 1', () => {
    const T = Syntax(`ReturnType<() => { x: 1, y: 2 }>`)
    Assert.IsTrue(TypeGuard.IsObject(T))
    Assert.IsTrue(T.properties.x.const === 1)
    Assert.IsTrue(T.properties.y.const === 2)
  })
  it('Should parse ReturnType 2', () => {
    const T = Syntax(`ReturnType<number>`) // generalization issue
    Assert.IsTrue(TypeGuard.IsNever(T))
  })
  it('Should parse String', () => {
    const T = Syntax(`string`)
    Assert.IsTrue(TypeGuard.IsString(T))
  })
  it('Should parse Symbol', () => {
    const T = Syntax(`symbol`)
    Assert.IsTrue(TypeGuard.IsSymbol(T))
  })
  it('Should parse Tuple', () => {
    const T = Syntax(`[0, 1, 2, 3]`)
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(T.items![0].const === 0)
    Assert.IsTrue(T.items![1].const === 1)
    Assert.IsTrue(T.items![2].const === 2)
    Assert.IsTrue(T.items![3].const === 3)
  })
  it('Should parse Uint8Array', () => {
    const T = Syntax(`Uint8Array`)
    Assert.IsTrue(TypeGuard.IsUint8Array(T))
  })
  it('Should parse Undefined', () => {
    const T = Syntax(`undefined`)
    Assert.IsTrue(TypeGuard.IsUndefined(T))
  })
  it('Should parse Union 1', () => {
    const T = Syntax(`1 | 2`)
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(T.anyOf[0].const === 1)
    Assert.IsTrue(T.anyOf[1].const === 2)
  })
  it('Should parse Union 2', () => {
    const T = Syntax(`1 | (2 | 3)`)
    Assert.IsTrue(TypeGuard.IsUnion(T))
    Assert.IsTrue(T.anyOf[0].const === 1)
    Assert.IsTrue(T.anyOf[1].const === 2)
    Assert.IsTrue(T.anyOf[2].const === 3)
  })
  it('Should parse Unknown', () => {
    const T = Syntax(`unknown`)
    Assert.IsTrue(TypeGuard.IsUnknown(T))
  })
  it('Should parse Void', () => {
    const T = Syntax(`void`)
    Assert.IsTrue(TypeGuard.IsVoid(T))
  })
  // ----------------------------------------------------------------
  // Argument + Instantiation
  // ----------------------------------------------------------------
  it('Should parse Argument 0', () => {
    const G = Syntax(`[Argument<0>]`)
    const T = Syntax({ G }, `G`)
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsArgument(T.items![0]))
  })
  it('Should parse Argument 1', () => {
    const G = Syntax(`[Argument<0>]`)
    const T = Syntax({ G }, `G<number>`)
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
  })
  it('Should parse Argument 2', () => {
    const G = Syntax(`[Argument<0>, Argument<1>]`)
    const T = Syntax({ G }, `G<number, string>`)
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsString(T.items![1]))
  })
  it('Should parse Argument 3', () => {
    const G = Syntax(`[Argument<0>, Argument<1>]`)
    const T = Syntax({ G }, `G<number>`)
    Assert.IsTrue(TypeGuard.IsTuple(T))
    Assert.IsTrue(TypeGuard.IsNumber(T.items![0]))
    Assert.IsTrue(TypeGuard.IsUnknown(T.items![1]))
  })
})
