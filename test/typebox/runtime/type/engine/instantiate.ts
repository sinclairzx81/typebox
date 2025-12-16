import { Assert } from 'test'
import * as Type from 'typebox'

const Test = Assert.Context('Type.Engine.Instantiate')

// ------------------------------------------------------------------
// Ref: Resolvable
// ------------------------------------------------------------------
Test('Should Instantiate 1', () => {
  const A: Type.TArray<Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Array(Type.Ref('A')))
  Assert.IsTrue(Type.IsArray(A))
  Assert.IsTrue(Type.IsNumber(A.items))
})
Test('Should Instantiate 2', () => {
  const A = Type.Instantiate({ A: Type.Number() }, Type.AsyncIterator(Type.Ref('A')))
  Assert.IsTrue(Type.IsAsyncIterator(A))
  Assert.IsTrue(Type.IsNumber(A.iteratorItems))
})
Test('Should Instantiate 3', () => {
  const A: Type.TConstructor<[Type.TNumber], Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Constructor([Type.Ref('A')], Type.Ref('A')))
  Assert.IsTrue(Type.IsConstructor(A))
  Assert.IsTrue(Type.IsNumber(A.parameters[0]))
  Assert.IsTrue(Type.IsNumber(A.instanceType))
})
Test('Should Instantiate 4', () => {
  const A: Type.TNumber = Type.Instantiate({ A: Type.Generic([Type.Parameter('A')], Type.Ref('A')) }, Type.Call(Type.Ref('A'), [Type.Number()]))
  Assert.IsTrue(Type.IsNumber(A))
})
Test('Should Instantiate 5', () => {
  const A: Type.TNumber = Type.Instantiate({ A: Type.Deferred('Evaluate', [Type.Number()], {}) }, Type.Ref('A'))
  Assert.IsTrue(Type.IsNumber(A))
})
Test('Should Instantiate 6', () => {
  const A: Type.TFunction<[Type.TNumber], Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Function([Type.Ref('A')], Type.Ref('A')))
  Assert.IsTrue(Type.IsFunction(A))
  Assert.IsTrue(Type.IsNumber(A.parameters[0]))
  Assert.IsTrue(Type.IsNumber(A.returnType))
})
Test('Should Instantiate 7', () => {
  const A: Type.TIntersect<[Type.TNull, Type.TNumber]> = Type.Instantiate({ A: Type.Number() }, Type.Intersect([Type.Null(), Type.Ref('A')]))
  Assert.IsTrue(Type.IsIntersect(A))
  Assert.IsTrue(Type.IsNull(A.allOf[0]))
  Assert.IsTrue(Type.IsNumber(A.allOf[1]))
})
Test('Should Instantiate 8', () => {
  const A: Type.TIterator<Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Iterator(Type.Ref('A')))
  Assert.IsTrue(Type.IsIterator(A))
  Assert.IsTrue(Type.IsNumber(A.iteratorItems))
})
Test('Should Instantiate 9', () => {
  const A: Type.TObject<{ x: Type.TNumber }> = Type.Instantiate({ A: Type.Number() }, Type.Object({ x: Type.Ref('A') }))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
})
Test('Should Instantiate 10', () => {
  const A: Type.TPromise<Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Promise(Type.Ref('A')))
  Assert.IsTrue(Type.IsPromise(A))
  Assert.IsTrue(Type.IsNumber(A.item))
})
Test('Should Instantiate 11', () => {
  const A: Type.TRecord<'^.*$', Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Record(Type.String(), Type.Ref('A')))
  Assert.IsTrue(Type.IsRecord(A))
  Assert.IsTrue(Type.IsString(Type.RecordKey(A)))
  Assert.IsTrue(Type.IsNumber(Type.RecordValue(A)))
})
Test('Should Instantiate 12', () => {
  const A: Type.TRest<Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Rest(Type.Ref('A')))
  Assert.IsTrue(Type.IsRest(A))
  Assert.IsTrue(Type.IsNumber(A.items))
})
Test('Should Instantiate 13', () => {
  const A: Type.TTuple<[Type.TNumber]> = Type.Instantiate({ A: Type.Number() }, Type.Tuple([Type.Ref('A')]))
  Assert.IsTrue(Type.IsTuple(A))
  Assert.IsTrue(Type.IsNumber(A.items[0]))
})
Test('Should Instantiate 14', () => {
  const A: Type.TUnion<[Type.TNull, Type.TNumber]> = Type.Instantiate({ A: Type.Number() }, Type.Union([Type.Null(), Type.Ref('A')]))
  Assert.IsTrue(Type.IsUnion(A))
  Assert.IsTrue(Type.IsNull(A.anyOf[0]))
  Assert.IsTrue(Type.IsNumber(A.anyOf[1]))
})
// ------------------------------------------------------------------
// Ref: Unresolvable
// ------------------------------------------------------------------
Test('Should Instantiate 15', () => {
  const A: Type.TArray<Type.TRef<'A'>> = Type.Instantiate({}, Type.Array(Type.Ref('A')))
  Assert.IsTrue(Type.IsArray(A))
  Assert.IsTrue(Type.IsRef(A.items))
  Assert.IsEqual(A.items.$ref, 'A')
})
Test('Should Instantiate 16', () => {
  const A: Type.TAsyncIterator<Type.TRef<'A'>> = Type.Instantiate({}, Type.AsyncIterator(Type.Ref('A')))
  Assert.IsTrue(Type.IsAsyncIterator(A))
  Assert.IsTrue(Type.IsRef(A.iteratorItems))
  Assert.IsEqual(A.iteratorItems.$ref, 'A')
})
Test('Should Instantiate 17', () => {
  const A: Type.TConstructor<[Type.TRef<'A'>], Type.TRef<'A'>> = Type.Instantiate({}, Type.Constructor([Type.Ref('A')], Type.Ref('A')))
  Assert.IsTrue(Type.IsConstructor(A))
  Assert.IsTrue(Type.IsRef(A.parameters[0]))
  Assert.IsEqual(A.parameters[0].$ref, 'A')
  Assert.IsTrue(Type.IsRef(A.instanceType))
  Assert.IsEqual(A.instanceType.$ref, 'A')
})
Test('Should Instantiate 18', () => {
  const A: Type.TCall<Type.TRef<'A'>, [Type.TNumber]> = Type.Instantiate({}, Type.Call(Type.Ref('A'), [Type.Number()]))
  Assert.IsTrue(Type.IsCall(A))
  Assert.IsTrue(Type.IsRef(A.target))
  Assert.IsEqual(A.target.$ref, 'A')
  Assert.IsTrue(Type.IsNumber(A.arguments[0]))
})
Test('Should Instantiate 19', () => {
  const A: Type.TRef<'A'> = Type.Instantiate({}, Type.Ref('A'))
  Assert.IsTrue(Type.IsRef(A))
  Assert.IsEqual(A.$ref, 'A')
})
Test('Should Instantiate 20', () => {
  const A: Type.TFunction<[Type.TRef<'A'>], Type.TRef<'A'>> = Type.Instantiate({}, Type.Function([Type.Ref('A')], Type.Ref('A')))
  Assert.IsTrue(Type.IsFunction(A))
  Assert.IsTrue(Type.IsRef(A.parameters[0]))
  Assert.IsEqual(A.parameters[0].$ref, 'A')
  Assert.IsTrue(Type.IsRef(A.returnType))
  Assert.IsEqual(A.returnType.$ref, 'A')
})
Test('Should Instantiate 21', () => {
  const A: Type.TIntersect<[Type.TNull, Type.TRef<'A'>]> = Type.Instantiate({}, Type.Intersect([Type.Null(), Type.Ref('A')]))
  Assert.IsTrue(Type.IsIntersect(A))
  Assert.IsTrue(Type.IsNull(A.allOf[0]))
  Assert.IsTrue(Type.IsRef(A.allOf[1]))
  Assert.IsEqual(A.allOf[1].$ref, 'A')
})
Test('Should Instantiate 22', () => {
  const A: Type.TIterator<Type.TRef<'A'>> = Type.Instantiate({}, Type.Iterator(Type.Ref('A')))
  Assert.IsTrue(Type.IsIterator(A))
  Assert.IsTrue(Type.IsRef(A.iteratorItems))
  Assert.IsEqual(A.iteratorItems.$ref, 'A')
})
Test('Should Instantiate 23', () => {
  const A: Type.TObject<{ x: Type.TRef<'A'> }> = Type.Instantiate({}, Type.Object({ x: Type.Ref('A') }))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsRef(A.properties.x))
  Assert.IsEqual(A.properties.x.$ref, 'A')
})
Test('Should Instantiate 24', () => {
  const A: Type.TPromise<Type.TRef<'A'>> = Type.Instantiate({}, Type.Promise(Type.Ref('A')))
  Assert.IsTrue(Type.IsPromise(A))
  Assert.IsTrue(Type.IsRef(A.item))
  Assert.IsEqual(A.item.$ref, 'A')
})
Test('Should Instantiate 25', () => {
  const A: Type.TRecordDeferred<Type.TRef<'A'>, Type.TRef<'A'>> = Type.Instantiate({}, Type.Record(Type.Ref('A'), Type.Ref('A')))
  Assert.IsTrue(Type.IsDeferred(A))
  Assert.IsTrue(Type.IsRef(A.parameters[0]))
  Assert.IsTrue(Type.IsRef(A.parameters[1]))
})
Test('Should Instantiate 26', () => {
  const A: Type.TRest<Type.TRef<'A'>> = Type.Instantiate({}, Type.Rest(Type.Ref('A')))
  Assert.IsTrue(Type.IsRest(A))
  Assert.IsTrue(Type.IsRef(A.items))
  Assert.IsEqual(A.items.$ref, 'A')
})
Test('Should Instantiate 27', () => {
  const A: Type.TTuple<[Type.TRef<'A'>]> = Type.Instantiate({}, Type.Tuple([Type.Ref('A')]))
  Assert.IsTrue(Type.IsTuple(A))
  Assert.IsTrue(Type.IsRef(A.items[0]))
  Assert.IsEqual(A.items[0].$ref, 'A')
})
Test('Should Instantiate 28', () => {
  const A: Type.TUnion<[Type.TNull, Type.TRef<'A'>]> = Type.Instantiate({}, Type.Union([Type.Null(), Type.Ref('A')]))
  Assert.IsTrue(Type.IsUnion(A))
  Assert.IsTrue(Type.IsNull(A.anyOf[0]))
  Assert.IsTrue(Type.IsRef(A.anyOf[1]))
  Assert.IsEqual(A.anyOf[1].$ref, 'A')
})
// ------------------------------------------------------------------
// Ref: Partial Resolution
// ------------------------------------------------------------------
Test('Should Instantiate 29', () => {
  const A: Type.TConstructor<[Type.TNumber], Type.TRef<'B'>> = Type.Instantiate({ A: Type.Number() }, Type.Constructor([Type.Ref('A')], Type.Ref('B')))
  Assert.IsTrue(Type.IsConstructor(A))
  Assert.IsTrue(Type.IsNumber(A.parameters[0]))
  Assert.IsTrue(Type.IsRef(A.instanceType))
  Assert.IsEqual(A.instanceType.$ref, 'B')
})
Test('Should Instantiate 30', () => {
  const A: Type.TConstructor<[Type.TRef<'B'>], Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Constructor([Type.Ref('B')], Type.Ref('A')))
  Assert.IsTrue(Type.IsConstructor(A))
  Assert.IsTrue(Type.IsRef(A.parameters[0]))
  Assert.IsEqual(A.parameters[0].$ref, 'B')
  Assert.IsTrue(Type.IsNumber(A.instanceType))
})
Test('Should Instantiate 31', () => {
  const A: Type.TFunction<[Type.TNumber], Type.TRef<'B'>> = Type.Instantiate({ A: Type.Number() }, Type.Function([Type.Ref('A')], Type.Ref('B')))
  Assert.IsTrue(Type.IsFunction(A))
  Assert.IsTrue(Type.IsNumber(A.parameters[0]))
  Assert.IsTrue(Type.IsRef(A.returnType))
  Assert.IsEqual(A.returnType.$ref, 'B')
})
Test('Should Instantiate 32', () => {
  const A: Type.TFunction<[Type.TRef<'B'>], Type.TNumber> = Type.Instantiate({ A: Type.Number() }, Type.Function([Type.Ref('B')], Type.Ref('A')))
  Assert.IsTrue(Type.IsFunction(A))
  Assert.IsTrue(Type.IsRef(A.parameters[0]))
  Assert.IsEqual(A.parameters[0].$ref, 'B')
  Assert.IsTrue(Type.IsNumber(A.returnType))
})
Test('Should Instantiate 33', () => {
  const A: Type.TIntersect<[Type.TNumber, Type.TRef<'B'>]> = Type.Instantiate({ A: Type.Number() }, Type.Intersect([Type.Ref('A'), Type.Ref('B')]))
  Assert.IsTrue(Type.IsIntersect(A))
  Assert.IsTrue(Type.IsNumber(A.allOf[0]))
  Assert.IsTrue(Type.IsRef(A.allOf[1]))
  Assert.IsEqual(A.allOf[1].$ref, 'B')
})
Test('Should Instantiate 34', () => {
  const A: Type.TObject<{ x: Type.TNumber; y: Type.TRef<'B'> }> = Type.Instantiate({ A: Type.Number() }, Type.Object({ x: Type.Ref('A'), y: Type.Ref('B') }))
  Assert.IsTrue(Type.IsObject(A))
  Assert.IsTrue(Type.IsNumber(A.properties.x))
  Assert.IsTrue(Type.IsRef(A.properties.y))
  Assert.IsEqual(A.properties.y.$ref, 'B')
})
Test('Should Instantiate 35', () => {
  const A: Type.TRecord<'^-?(?:0|[1-9][0-9]*)(?:.[0-9]+)?$', Type.TRef<'B'>> = Type.Instantiate({ A: Type.Number() }, Type.Record(Type.Ref('A'), Type.Ref('B')))
  Assert.IsTrue(Type.IsRecord(A))
  Assert.IsTrue(Type.IsNumber(Type.RecordKey(A)))
  Assert.IsTrue(Type.IsRef(Type.RecordValue(A)))
})
Test('Should Instantiate 36', () => {
  const A: Type.TRecordDeferred<Type.TRef<'B'>, Type.TRef<'A'>> = Type.Instantiate({ A: Type.Number() }, Type.Record(Type.Ref('B'), Type.Ref('A')))
  Assert.IsTrue(Type.IsDeferred(A))
  Assert.IsTrue(Type.IsRef(A.parameters[0]))
  Assert.IsTrue(Type.IsRef(A.parameters[1]))
})
Test('Should Instantiate 37', () => {
  const A: Type.TTuple<[Type.TNumber, Type.TRef<'B'>]> = Type.Instantiate({ A: Type.Number() }, Type.Tuple([Type.Ref('A'), Type.Ref('B')]))
  Assert.IsTrue(Type.IsTuple(A))
  Assert.IsTrue(Type.IsNumber(A.items[0]))
  Assert.IsTrue(Type.IsRef(A.items[1]))
  Assert.IsEqual(A.items[1].$ref, 'B')
})
Test('Should Instantiate 38', () => {
  const A: Type.TUnion<[Type.TNumber, Type.TRef<'B'>]> = Type.Instantiate({ A: Type.Number() }, Type.Union([Type.Ref('A'), Type.Ref('B')]))
  Assert.IsTrue(Type.IsUnion(A))
  Assert.IsTrue(Type.IsNumber(A.anyOf[0]))
  Assert.IsTrue(Type.IsRef(A.anyOf[1]))
  Assert.IsEqual(A.anyOf[1].$ref, 'B')
})
// ------------------------------------------------------------------
// Deferred: Unknown
// ------------------------------------------------------------------
Test('Should Instantiate 39', () => {
  const A: Type.TDeferred<'Foo', []> = Type.Instantiate({ A: Type.Deferred('Foo', [], {}) }, Type.Ref('A'))
  Assert.IsTrue(Type.IsDeferred(A))
  Assert.IsEqual(A.action, 'Foo')
  Assert.IsEqual(A.parameters, [])
})
// ------------------------------------------------------------------
// Cyclic
// ------------------------------------------------------------------
Test('Should Instantiate 40', () => {
  const A = Type.Instantiate({ A: Type.Ref('B'), B: Type.Ref('A') }, Type.Ref('A'))
  Assert.IsTrue(Type.IsRef(A))
  Assert.IsEqual(A.$ref, 'A')
})
