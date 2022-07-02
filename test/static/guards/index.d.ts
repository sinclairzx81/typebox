import { TAny, TArray, TBoolean, TConstructor, TFunction, TInteger, TLiteral, TNull, TNumber, TObject, TPromise, TRecord, TRef, TSchema, TSelf, TString, TTuple, TUint8Array, TUndefined, TUnion, TUnknown, TVoid } from '../typebox'
declare type TypeGuard<T extends TSchema> = (value: object) => value is T
export declare namespace TypeGuard {
  function isTSchema(value: object): value is TSchema
  const isTAny: TypeGuard<TAny>
  const isTArray: TypeGuard<TArray<TSchema>>
  const isTBoolean: TypeGuard<TBoolean>
  const isTConstructor: TypeGuard<TConstructor<TSchema[], TSchema>>
  const isTFunction: TypeGuard<TFunction<TSchema[], TSchema>>
  const isTInteger: TypeGuard<TInteger>
  const isTLiteral: TypeGuard<TLiteral<import('../typebox').TLiteralValue>>
  const isTNull: TypeGuard<TNull>
  const isTNumber: TypeGuard<TNumber>
  const isTObject: TypeGuard<TObject<import('../typebox').TProperties>>
  const isTPromise: TypeGuard<TPromise<TSchema>>
  const isTRecord: TypeGuard<TRecord<import('../typebox').TRecordKey, TSchema>>
  const isTSelf: TypeGuard<TSelf>
  const isTRef: TypeGuard<TRef<TSchema>>
  const isTString: TypeGuard<TString>
  const isTTuple: TypeGuard<TTuple<TSchema[]>>
  const isTUndefined: TypeGuard<TUndefined>
  const isTUnion: TypeGuard<TUnion<TSchema[]>>
  const isTUint8Array: TypeGuard<TUint8Array>
  const isTUnknown: TypeGuard<TUnknown>
  const isTVoid: TypeGuard<TVoid>
}
export {}
