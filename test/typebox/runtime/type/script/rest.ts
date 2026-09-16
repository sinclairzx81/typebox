import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Script.Rest')

// ------------------------------------------------------------------
// Rest: Argument Position
// ------------------------------------------------------------------
Test('Should Rest 1', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends number[], Result extends unknown[] = ['start', ...Input, 'end']> = Result
    type Result = Rest<[1, 2, 3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 3)
  Assert.IsEqual(Result.items[4].const, 4)
  Assert.IsEqual(Result.items[5].const, 'end')
})
Test('Should Rest 2', () => {
  const Result: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends number[], Result extends unknown[] = [...Input, 'end']> = Result
    type Result = Rest<[1, 2, 3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 1)
  Assert.IsEqual(Result.items[1].const, 2)
  Assert.IsEqual(Result.items[2].const, 3)
  Assert.IsEqual(Result.items[3].const, 4)
  Assert.IsEqual(Result.items[4].const, 'end')
})
Test('Should Rest 3', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>]> = Type.Script(`
    type Rest<Input extends number[], Result extends unknown[] = ['start', ...Input]> = Result
    type Result = Rest<[1, 2, 3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 3)
  Assert.IsEqual(Result.items[4].const, 4)
})
Test('Should Rest 4', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[], Result extends unknown[] = ['start', ...A, ...B, 'end']> = Result
    type Result = Rest<[1, 2], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 3)
  Assert.IsEqual(Result.items[4].const, 4)
  Assert.IsEqual(Result.items[5].const, 'end')
})
Test('Should Rest 5', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<'mid'>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[], Result extends unknown[] = ['start', ...A, 'mid', ...B, 'end']> = Result
    type Result = Rest<[1, 2], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 'mid')
  Assert.IsEqual(Result.items[4].const, 3)
  Assert.IsEqual(Result.items[5].const, 4)
  Assert.IsEqual(Result.items[6].const, 'end')
})
Test('Should Rest 6', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends number[], Result extends unknown[] = ['start', ...Input, 'end']> = Result
    type Result = Rest<[]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 'end')
})
Test('Should Rest 7', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[], Result extends unknown[] = ['start', ...A, ...B, 'end']> = Result
    type Result = Rest<[], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 3)
  Assert.IsEqual(Result.items[2].const, 4)
  Assert.IsEqual(Result.items[3].const, 'end')
})
Test('Should Rest 8', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[], Result extends unknown[] = ['start', ...A, ...B, 'end']> = Result
    type Result = Rest<[], []>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 'end')
})
Test('Should Rest 9', () => {
  const Result: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>]> = Type.Script(`
    type Rest<A extends number[], B extends number[], Result extends unknown[] = [...A, ...B]> = Result
    type Result = Rest<[1, 2], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 1)
  Assert.IsEqual(Result.items[1].const, 2)
  Assert.IsEqual(Result.items[2].const, 3)
  Assert.IsEqual(Result.items[3].const, 4)
})
Test('Should Rest 10', () => {
  const Result: Type.TTuple<[
    Type.TLiteral<'start'>,
    Type.TLiteral<1>,
    Type.TLiteral<2>,
    Type.TLiteral<'mid1'>,
    Type.TLiteral<3>,
    Type.TLiteral<4>,
    Type.TLiteral<'mid2'>,
    Type.TLiteral<5>,
    Type.TLiteral<6>,
    Type.TLiteral<'end'>
  ]> = Type.Script(`
    type Rest<A extends number[], B extends number[], C extends number[], Result extends unknown[] = ['start', ...A, 'mid1', ...B, 'mid2', ...C, 'end']> = Result
    type Result = Rest<[1, 2], [3, 4], [5, 6]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 'mid1')
  Assert.IsEqual(Result.items[4].const, 3)
  Assert.IsEqual(Result.items[5].const, 4)
  Assert.IsEqual(Result.items[6].const, 'mid2')
  Assert.IsEqual(Result.items[7].const, 5)
  Assert.IsEqual(Result.items[8].const, 6)
  Assert.IsEqual(Result.items[9].const, 'end')
})
Test('Should Rest 11', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<'a'>, Type.TLiteral<true>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends unknown[], Result extends unknown[] = ['start', ...Input, 'end']> = Result
    type Result = Rest<[1, 'a', true]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 'a')
  Assert.IsEqual(Result.items[3].const, true)
  Assert.IsEqual(Result.items[4].const, 'end')
})
// ------------------------------------------------------------------
// Rest: Expression Position
// ------------------------------------------------------------------
Test('Should Rest 12', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends number[]> = ['start', ...Input, 'end']
    type Result = Rest<[1, 2, 3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 3)
  Assert.IsEqual(Result.items[4].const, 4)
  Assert.IsEqual(Result.items[5].const, 'end')
})
Test('Should Rest 13', () => {
  const Result: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends number[]> = [...Input, 'end']
    type Result = Rest<[1, 2, 3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 1)
  Assert.IsEqual(Result.items[1].const, 2)
  Assert.IsEqual(Result.items[2].const, 3)
  Assert.IsEqual(Result.items[3].const, 4)
  Assert.IsEqual(Result.items[4].const, 'end')
})
Test('Should Rest 14', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>]> = Type.Script(`
    type Rest<Input extends number[]> = ['start', ...Input]
    type Result = Rest<[1, 2, 3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 3)
  Assert.IsEqual(Result.items[4].const, 4)
})
Test('Should Rest 15', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[]> = ['start', ...A, ...B, 'end']
    type Result = Rest<[1, 2], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 3)
  Assert.IsEqual(Result.items[4].const, 4)
  Assert.IsEqual(Result.items[5].const, 'end')
})
Test('Should Rest 16', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<'mid'>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[]> = ['start', ...A, 'mid', ...B, 'end']
    type Result = Rest<[1, 2], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 'mid')
  Assert.IsEqual(Result.items[4].const, 3)
  Assert.IsEqual(Result.items[5].const, 4)
  Assert.IsEqual(Result.items[6].const, 'end')
})
Test('Should Rest 17', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends number[]> = ['start', ...Input, 'end']
    type Result = Rest<[]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 'end')
})
Test('Should Rest 18', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<3>, Type.TLiteral<4>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[]> = ['start', ...A, ...B, 'end']
    type Result = Rest<[], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 3)
  Assert.IsEqual(Result.items[2].const, 4)
  Assert.IsEqual(Result.items[3].const, 'end')
})
Test('Should Rest 19', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<A extends number[], B extends number[]> = ['start', ...A, ...B, 'end']
    type Result = Rest<[], []>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 'end')
})
Test('Should Rest 20', () => {
  const Result: Type.TTuple<[Type.TLiteral<1>, Type.TLiteral<2>, Type.TLiteral<3>, Type.TLiteral<4>]> = Type.Script(`
    type Rest<A extends number[], B extends number[]> = [...A, ...B]
    type Result = Rest<[1, 2], [3, 4]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 1)
  Assert.IsEqual(Result.items[1].const, 2)
  Assert.IsEqual(Result.items[2].const, 3)
  Assert.IsEqual(Result.items[3].const, 4)
})
Test('Should Rest 21', () => {
  const Result: Type.TTuple<[
    Type.TLiteral<'start'>,
    Type.TLiteral<1>,
    Type.TLiteral<2>,
    Type.TLiteral<'mid1'>,
    Type.TLiteral<3>,
    Type.TLiteral<4>,
    Type.TLiteral<'mid2'>,
    Type.TLiteral<5>,
    Type.TLiteral<6>,
    Type.TLiteral<'end'>
  ]> = Type.Script(`
    type Rest<A extends number[], B extends number[], C extends number[]> = ['start', ...A, 'mid1', ...B, 'mid2', ...C, 'end']
    type Result = Rest<[1, 2], [3, 4], [5, 6]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 2)
  Assert.IsEqual(Result.items[3].const, 'mid1')
  Assert.IsEqual(Result.items[4].const, 3)
  Assert.IsEqual(Result.items[5].const, 4)
  Assert.IsEqual(Result.items[6].const, 'mid2')
  Assert.IsEqual(Result.items[7].const, 5)
  Assert.IsEqual(Result.items[8].const, 6)
  Assert.IsEqual(Result.items[9].const, 'end')
})
Test('Should Rest 22', () => {
  const Result: Type.TTuple<[Type.TLiteral<'start'>, Type.TLiteral<1>, Type.TLiteral<'a'>, Type.TLiteral<true>, Type.TLiteral<'end'>]> = Type.Script(`
    type Rest<Input extends unknown[]> = ['start', ...Input, 'end']
    type Result = Rest<[1, 'a', true]>
  `).Result
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 1)
  Assert.IsEqual(Result.items[2].const, 'a')
  Assert.IsEqual(Result.items[3].const, true)
  Assert.IsEqual(Result.items[4].const, 'end')
})
// ------------------------------------------------------------------
// Large Tuple
// ------------------------------------------------------------------
Test('Should Rest 23', () => {
  const N = 128
  const input = `[${Array.from({ length: N }, (_, i) => i).join(', ')}]`
  const Result: any = Type.Script(`
    type Rest<Input extends number[], Result extends unknown[] = ['start', ...Input, 'end']> = Result
    type Result = Rest<${input}>
  `).Result
  Assert.IsEqual(Result.items.length, N + 2)
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 0)
  Assert.IsEqual(Result.items[N].const, N - 1)
  Assert.IsEqual(Result.items[N + 1].const, 'end')
})
Test('Should Rest 24', () => {
  const N = 128
  const input = `[${Array.from({ length: N }, (_, i) => i).join(', ')}]`
  const Result: any = Type.Script(`
    type Rest<Input extends number[]> = ['start', ...Input, 'end']
    type Result = Rest<${input}>
  `).Result
  Assert.IsEqual(Result.items.length, N + 2)
  Assert.IsEqual(Result.items[0].const, 'start')
  Assert.IsEqual(Result.items[1].const, 0)
  Assert.IsEqual(Result.items[N].const, N - 1)
  Assert.IsEqual(Result.items[N + 1].const, 'end')
})
