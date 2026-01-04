/*--------------------------------------------------------------------------

TypeBox

The MIT License (MIT)

Copyright (c) 2017-2025 Haydn Paterson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

// ------------------------------------------------------------------
// Engine
// ------------------------------------------------------------------
export { Instantiate, type TInstantiate } from './type/engine/instantiate.ts'

// ------------------------------------------------------------------
// Extends
// ------------------------------------------------------------------
export { Extends, ExtendsResult, type TExtends } from './type/extends/index.ts'

// ------------------------------------------------------------------
// Script
// ------------------------------------------------------------------
export { Script, type TScript } from './type/script/index.ts'

// ------------------------------------------------------------------
// Actions
// ------------------------------------------------------------------
export { Assign, type TAssign } from './type/action/assign.ts'
export { Capitalize, type TCapitalize, type TCapitalizeDeferred } from './type/action/capitalize.ts'
export { Conditional, type TConditional, type TConditionalDeferred } from './type/action/conditional.ts'
export { ConstructorParameters, type TConstructorParameters, type TConstructorParametersDeferred } from './type/action/constructor-parameters.ts'
export { Evaluate, type TEvaluate, type TEvaluateDeferred } from './type/action/evaluate.ts'
export { Exclude, type TExclude, type TExcludeDeferred } from './type/action/exclude.ts'
export { Extract, type TExtract, type TExtractDeferred } from './type/action/extract.ts'
export { Index, type TIndex, type TIndexDeferred } from './type/action/index.ts'
export { InstanceType, type TInstanceType, type TInstanceTypeDeferred } from './type/action/instance-type.ts'
export { Interface, type TInterface, type TInterfaceDeferred } from './type/action/interface.ts'
export { KeyOf, type TKeyOf, type TKeyOfDeferred } from './type/action/keyof.ts'
export { Lowercase, type TLowercase, type TLowercaseDeferred } from './type/action/lowercase.ts'
export { Mapped, type TMapped, type TMappedDeferred } from './type/action/mapped.ts'
export { Module, type TModule, type TModuleDeferred } from './type/action/module.ts'
export { NonNullable, type TNonNullable, type TNonNullableDeferred } from './type/action/non-nullable.ts'
export { Omit, type TOmit, type TOmitDeferred } from './type/action/omit.ts'
export { Parameters, type TParameters, type TParametersDeferred } from './type/action/parameters.ts'
export { Partial, type TPartial, type TPartialDeferred } from './type/action/partial.ts'
export { Pick, type TPick, type TPickDeferred } from './type/action/pick.ts'
export { ReadonlyObject as ReadonlyObject, type TReadonlyObject as TReadonlyObject, type TReadonlyObjectDeferred as TReadonlyObjectDeferred } from './type/action/readonly-type.ts'
export { Required, type TRequired, type TRequiredDeferred } from './type/action/required.ts'
export { ReturnType, type TReturnType, type TReturnTypeDeferred } from './type/action/return-type.ts'
export { type TUncapitalize, type TUncapitalizeDeferred, Uncapitalize } from './type/action/uncapitalize.ts'
export { type TUppercase, type TUppercaseDeferred, Uppercase } from './type/action/uppercase.ts'

// ------------------------------------------------------------------
// Modifiers
// ------------------------------------------------------------------
export { Immutable, IsImmutable, type TImmutable } from './type/types/_immutable.ts'
export { IsOptional, Optional, type TOptional } from './type/types/_optional.ts'
export { IsReadonly, Readonly, type TReadonly } from './type/types/_readonly.ts'

// ------------------------------------------------------------------
// Standard
// ------------------------------------------------------------------
export { Any, IsAny, type TAny } from './type/types/any.ts'
export { Array, IsArray, type TArray } from './type/types/array.ts'
export { BigInt, IsBigInt, type TBigInt } from './type/types/bigint.ts'
export { Boolean, IsBoolean, type TBoolean } from './type/types/boolean.ts'
export { Call, IsCall, type TCall } from './type/types/call.ts'
export { Constructor, IsConstructor, type TConstructor } from './type/types/constructor.ts'
export { Cyclic, IsCyclic, type TCyclic } from './type/types/cyclic.ts'
export { Enum, IsEnum, type TEnum, type TEnumValue } from './type/types/enum.ts'
export { Function, IsFunction, type TFunction } from './type/types/function.ts'
export { Generic, IsGeneric, type TGeneric } from './type/types/generic.ts'
export { Identifier, IsIdentifier, type TIdentifier } from './type/types/identifier.ts'
export { Infer, IsInfer, type TInfer } from './type/types/infer.ts'
export { Integer, IsInteger, type TInteger } from './type/types/integer.ts'
export { Intersect, IsIntersect, type TIntersect } from './type/types/intersect.ts'
export { IsLiteral, Literal, type TLiteral, type TLiteralValue } from './type/types/literal.ts'
export { IsNever, Never, type TNever } from './type/types/never.ts'
export { IsNull, Null, type TNull } from './type/types/null.ts'
export { IsNumber, Number, type TNumber } from './type/types/number.ts'
export { IsObject, Object, type TObject } from './type/types/object.ts'
export { IsParameter, Parameter, type TParameter } from './type/types/parameter.ts'
export { type TProperties, type TRequiredArray } from './type/types/properties.ts'
export { IsRecord, Record, RecordKey, RecordPattern as RecordKeyAsPattern, RecordValue, type TRecord, type TRecordKey as TRecordKey, type TRecordPattern as TRecordKeyAsPattern, type TRecordValue } from './type/types/record.ts'
export { IsRef, Ref, type TRef } from './type/types/ref.ts'
export { IsRest, Rest, type TRest } from './type/types/rest.ts'
export { IsKind, IsSchema, type TArrayOptions, type TFormat, type TIntersectOptions, type TNumberOptions, type TObjectOptions, type TSchema, type TSchemaOptions, type TStringOptions, type TTupleOptions } from './type/types/schema.ts'
export { type Static } from './type/types/static.ts'
export { IsString, String, type TString } from './type/types/string.ts'
export { IsSymbol, Symbol, type TSymbol } from './type/types/symbol.ts'
export { IsTemplateLiteral, TemplateLiteral, type TTemplateLiteral } from './type/types/template-literal.ts'
export { IsThis, This, type TThis } from './type/types/this.ts'
export { IsTuple, type TTuple, Tuple } from './type/types/tuple.ts'
export { IsUndefined, type TUndefined, Undefined } from './type/types/undefined.ts'
export { IsUnion, type TUnion, Union } from './type/types/union.ts'
export { IsUnknown, type TUnknown, Unknown } from './type/types/unknown.ts'
export { IsUnsafe, type TUnsafe, Unsafe } from './type/types/unsafe.ts'
export { IsVoid, type TVoid, Void } from './type/types/void.ts'
